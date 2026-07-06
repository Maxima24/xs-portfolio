// Engineering write-ups (P1.3). These turn the "Technical Depth" section from a
// list of concept names into evidence of reasoning: each post walks a real
// trade-off as problem -> naive approach & why it fails -> the decision -> how it
// was verified. They double as interview prep for the fintech-infrastructure moat.
//
// TODO(owner): these are DRAFTS seeded from the project descriptions. Before publishing,
// verify every incident-specific claim (bug details, dates, exact numbers, service names)
// — each post carries an `ownerVerify` banner flagging what still needs your confirmation.
// Prefer cutting an unverifiable specific over softening it into vagueness.

export interface WritingSection {
  heading: string;
  paragraphs: string[];
}

export interface WritingPost {
  slug: string;
  title: string;
  /** the system this write-up comes from */
  project: string;
  /** one-line summary shown in the index + meta description */
  dek: string;
  readingMinutes: number;
  /** draft-flag banner: what the owner must verify before this goes public */
  ownerVerify?: string;
  sections: WritingSection[];
}

export const writingPosts: WritingPost[] = [
  {
    slug: 'balances-authoritative-node',
    title: 'Why the application node — not the database — is authoritative on balances',
    project: 'SwiftHum',
    dek: 'An offline-capable P2P payment system can’t trust the database as the single source of truth for a balance. Here’s where authority actually has to live, and why.',
    readingMinutes: 5,
    ownerVerify:
      'TODO(owner): confirm this maps to SwiftHum’s payments core (the spec referenced a "Sluice / Fiber node" not present in the repo). Verify the exact authoritative component, isolation level, and any balance-reconciliation details before publishing.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'SwiftHum moves money between two phones that may share only the air between them — a payment token is encoded into ultrasonic sound and played from one device to another, with no internet on the receiver. That constraint breaks the assumption most CRUD apps quietly rely on: that the database is always reachable and is therefore the natural place to decide whether a balance is sufficient.',
          'If the receiver is offline at the moment of transfer, "read the balance, check it, write the new balance" is not a transaction you can run end-to-end against the database at the point of sale. So the question becomes: what component is actually allowed to say a balance is real?',
        ],
      },
      {
        heading: 'The naive approach, and why it fails',
        paragraphs: [
          'The naive design makes the database row the source of truth and treats every service as a thin proxy over it: to spend, you SELECT the balance, subtract, and UPDATE. Under any concurrency this races — two transfers read the same balance and both succeed, double-spending. The usual patch is a row lock or a "current balance" column guarded by a WHERE clause, which helps online but does nothing for the offline case, where the spend decision has already left the building on a sound wave before the database ever hears about it.',
          'Storing a running balance as a mutable column also throws away history: when two views of the balance disagree — which they will, across an offline hop — you have no ledger to replay and no way to prove which transfers are legitimate versus replayed.',
        ],
      },
      {
        heading: 'The decision and its trade-offs',
        paragraphs: [
          'SwiftHum inverts the authority. The balance is not a mutable number the database owns; it is a derived fact over an append-only ledger, and the authoritative decision to admit a transfer lives in the payments service, enforced with HMAC-SHA256-signed tokens settled under Serializable isolation.',
          'Each token is signed, so a receiver (or the settling node) can verify authenticity without trusting the transport. Settlement is idempotent: replaying the same signed token — the obvious attack on an offline, broadcast medium — is a no-op, because the ledger keys on the token’s identity, not on wall-clock arrival. Serializable isolation on the settling path means concurrent transfers are ordered as if they ran one at a time, so the "both reads saw the same balance" race cannot resolve into a double-spend.',
          'The trade-off is cost: Serializable isolation is the strictest and most contention-prone level, and an append-only ledger is more storage and more query work than a single mutable column. That’s the right trade for money — correctness under adversarial replay beats throughput on a hot row — but it would be over-engineering for, say, a view counter.',
        ],
      },
      {
        heading: 'How it was verified',
        paragraphs: [
          'The properties worth checking are exactly the failure modes above: replay a captured token and confirm settlement is a no-op; fire concurrent transfers against the same balance and confirm the ledger admits only what the balance supports; and reconcile the derived balance against the ledger to confirm they never drift.',
          'The general principle travels beyond ultrasonic payments: when a system has to stay correct across an untrusted or intermittent boundary, authority belongs to the component that can enforce it (a signed, idempotent, serializable ledger), not to whichever datastore happens to hold the latest number.',
        ],
      },
    ],
  },
  {
    slug: 'paystack-silent-loss',
    title: 'Catching a silent-loss bug on the Paystack settlement path',
    project: 'QuickBite',
    dek: 'The worst payment bugs don’t error — they quietly drop state while everything reports success. How a settlement-path gap on QuickBite could hide, and how to make it loud.',
    readingMinutes: 5,
    ownerVerify:
      'TODO(owner): a real production incident is the strongest possible proof — but only if it happened. Verify the specifics of this bug (what was actually lost, how it was detected, the fix) or reframe as a class of bug you designed against. Do not present a hypothetical as a real incident.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'QuickBite takes real money through Paystack, in production, on an AWS EC2 + Dockerized stack behind Nginx and Cloudflare. In a payment flow the dangerous failures are not the ones that throw — a 500 is visible and gets retried. The dangerous ones are silent: the customer is charged, the gateway reports success, and yet the order’s internal state never advances. Money moved; the system says nothing is wrong.',
          'This class of bug lives in the seam between "the payment provider confirmed" and "our database recorded the consequence." Anything that can happen between those two facts — a dropped webhook, a non-idempotent handler, a transaction that commits the charge but not the fulfilment — is a silent loss.',
        ],
      },
      {
        heading: 'The naive approach, and why it fails',
        paragraphs: [
          'The naive integration treats the synchronous checkout response as the source of truth: the client calls "verify payment," gets a success back, and the server marks the order paid in the same request. This works in the happy path and fails exactly when it matters. If the request that marks the order paid times out after the charge succeeds, the customer is charged and the order is not paid — and nothing errors loudly enough to notice.',
          'Relying only on the client-driven verify call also means a webhook retry from the gateway can double-apply, or an out-of-order webhook can overwrite a later state with an earlier one. Without idempotency and without treating the webhook as authoritative, "it worked in testing" hides a whole family of production-only races.',
        ],
      },
      {
        heading: 'The decision and its trade-offs',
        paragraphs: [
          'The settlement path is made authoritative and idempotent: the gateway webhook — verified by signature — is what actually transitions an order, and every transition keys on the payment reference so a retried or duplicated webhook resolves to the same state instead of a second charge’s worth of fulfilment. The synchronous verify call becomes a fast-path convenience, not the source of truth.',
          'To make silent loss loud, the invariant "every successful charge has a matching settled order" is checked continuously, not assumed. A reconciliation pass compares the gateway’s record of successful transactions against internal orders and surfaces any gap — a charge with no settled order is an alert, not a customer support ticket three days later.',
          'The trade-off is that the flow is now asynchronous and eventually consistent: the UI has to tolerate a brief "processing" state rather than promising instant confirmation. For payments that’s the correct bias — a moment of latency in exchange for never silently losing a settlement.',
        ],
      },
      {
        heading: 'How it was verified',
        paragraphs: [
          'The verification is the reconciliation itself: if the gateway’s successful-transaction total and the count of settled orders agree, the silent-loss window is closed; if they diverge, you’ve caught the exact failure the naive design would have hidden. Deliberately dropping and replaying webhooks in a staging environment confirms idempotency holds and that a missed webhook is recovered rather than lost.',
          'The lesson generalizes: on any money path, treat the provider’s asynchronous, signed callback as authoritative, make every state transition idempotent, and continuously reconcile the two systems of record so that a discrepancy pages you instead of accumulating quietly.',
        ],
      },
    ],
  },
  {
    slug: 'exactly-once-push-outbox',
    title: 'Exactly-once push across FCM and APNs with an outbox + dedup key',
    project: 'Cargoland',
    dek: 'Push notifications are at-least-once by nature. Delivering an order alert exactly once across two platforms means designing for duplicates instead of wishing them away.',
    readingMinutes: 6,
    ownerVerify:
      'TODO(owner): verify the delivery guarantees and dedup strategy actually shipped in Cargoland (vs. the notification-service study). Confirm any specifics before publishing.',
    sections: [
      {
        heading: 'The problem',
        paragraphs: [
          'Cargoland is three tightly-coupled apps — consumer, vendor, rider — kept in lockstep, and order alerts drive the whole marketplace: a vendor has to hear a new order, a rider has to hear an assignment. Those alerts go out over two different transports, FCM for Android and APNs for iOS, each of which is at-least-once by design. Neither platform promises a message arrives exactly once, and both will happily redeliver.',
          'So the requirement — "the vendor sees each order exactly once" — cannot be met by the transport. It has to be met by the system on top of it.',
        ],
      },
      {
        heading: 'The naive approach, and why it fails',
        paragraphs: [
          'The naive path fires a push inline with the event that caused it: when an order is created, the request handler calls FCM/APNs directly and moves on. Two things break. First, the send is now coupled to the request — if the push provider is slow or down, the order request is slow or fails, and a retry of that request sends the alert again. Second, there is no record that "this order’s alert was sent," so a retry, a redeploy mid-request, or a duplicate event all produce duplicate buzzes on the vendor’s phone.',
          'Trying to fix this by making the send "best effort and fire-and-forget" trades duplicates for lost alerts — now a transient provider blip means the vendor never hears about an order at all, which in a delivery marketplace is worse.',
        ],
      },
      {
        heading: 'The decision and its trade-offs',
        paragraphs: [
          'The design splits the decision to notify from the act of notifying, using the transactional outbox pattern. When an order is created, the notification intent is written to an outbox table in the same database transaction as the order itself — so either both commit or neither does, and there is no window where an order exists without its pending alert (or vice versa). A separate worker drains the outbox and calls FCM/APNs.',
          'Because the transports are at-least-once, the worker is built to expect redelivery: each notification carries a stable dedup key derived from the event (e.g. order id + channel), and both the send-side bookkeeping and the client collapse repeated deliveries of the same key into one. At-least-once transport plus idempotent, dedup-keyed handling gives the effect of exactly-once where it’s observable — on the vendor’s screen.',
          'The trade-offs: an outbox adds a write and a background worker, and delivery is asynchronous, so there’s a small, bounded delay between the order committing and the phone buzzing. In exchange you get a guarantee that survives provider outages, request retries, and redeploys — the failure modes that actually happen in production.',
        ],
      },
      {
        heading: 'How it was verified',
        paragraphs: [
          'The properties to test are the ones the naive version fails: kill the push worker mid-drain and confirm the outbox row is still pending and gets delivered on restart (nothing lost); force the transport to redeliver and confirm the dedup key collapses it to a single visible alert (nothing duplicated); and roll back the order transaction to confirm no orphan notification was sent.',
          'The same shape — write intent transactionally, drain it with an idempotent, dedup-keyed worker — is exactly the reliability spine behind the standalone Distributed Notification Service, which is why building one from the ground up is a deliberate study rather than a detour.',
        ],
      },
    ],
  },
];

export const writingBySlug: Record<string, WritingPost> = Object.fromEntries(
  writingPosts.map((p) => [p.slug, p]),
);
