import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Keystatic git-based CMS.
 *
 * Content lives as YAML files under content/**. A synchronous reader
 * (data/cms.ts) rebuilds the exact shapes the components already consume, so
 * the 3 per-track Vercel deploys keep building statically.
 *
 * Storage: GitHub-backed for the hosted admin (edits commit to the repo).
 * Set KEYSTATIC_STORAGE=local to edit against the working tree during dev.
 */
const storage =
  process.env.KEYSTATIC_STORAGE === 'local'
    ? ({ kind: 'local' } as const)
    : ({
        kind: 'github',
        repo: { owner: 'Maxima24', name: 'xs-portfolio' },
      } as const);

const accentField = fields.select({
  label: 'Accent',
  options: [
    { label: 'Cyan', value: 'cyan' },
    { label: 'Magenta', value: 'magenta' },
    { label: 'Lime', value: 'lime' },
  ],
  defaultValue: 'cyan',
});

const stringList = (label: string, itemLabel = 'Item') =>
  fields.array(fields.text({ label: itemLabel }), {
    label,
    itemLabel: (p) => p.value || itemLabel,
  });

export default config({
  storage,
  ui: {
    brand: { name: 'XS Portfolio' },
    navigation: {
      Tracks: ['tracks'],
      'Shared content': ['projects', 'sharedTechDepth', 'hackathons', 'writing'],
      Site: ['site'],
    },
  },
  collections: {
    // ── Shared project base facts (entered once; tracks reference + override) ──
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'content/projects/*',
      format: { data: 'yaml' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 1 } } },
        }),
        problem: fields.text({ label: 'Problem (one-line)', multiline: true }),
        role: fields.text({ label: 'Role (base framing)', multiline: true }),
        outcome: fields.text({ label: 'Outcome (base framing)', multiline: true }),
        stack: stringList('Stack', 'Tech'),
        image: fields.image({
          label: 'Cover image',
          directory: 'public/projects',
          publicPath: '/projects',
        }),
        accent: accentField,
        links: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.url({ label: 'URL' }),
            kind: fields.select({
              label: 'Kind',
              options: [
                { label: 'Live demo', value: 'live' },
                { label: 'Code / GitHub', value: 'github' },
              ],
              defaultValue: 'github',
            }),
          }),
          {
            label: 'Links',
            itemLabel: (p) => `${p.fields.kind.value}: ${p.fields.label.value || p.fields.href.value}`,
          },
        ),
      },
    }),

    // ── The three portfolio tracks (general / frontend / backend) ──
    tracks: collection({
      label: 'Tracks',
      slugField: 'name',
      path: 'content/tracks/*',
      format: { data: 'yaml' },
      columns: ['name', 'label'],
      schema: {
        name: fields.slug({
          name: { label: 'Track name', validation: { length: { min: 1 } } },
          slug: {
            label: 'Track key (general | frontend | backend)',
            description: 'Must match PORTFOLIO_TRACK. Do not change on existing tracks.',
          },
        }),
        label: fields.text({ label: 'Label (used in metadata/OG)' }),
        heroRole: fields.text({ label: 'Hero — role line' }),
        heroValueProp: fields.text({ label: 'Hero — value prop', multiline: true }),
        coreStack: fields.text({ label: 'Core stack (3 techs, e.g. "Go · TS · NestJS")' }),
        projectsIntro: fields.text({ label: 'Projects section intro', multiline: true }),
        techDepthIntro: fields.text({ label: 'Tech-depth section intro', multiline: true }),
        // SEO (was data/tracks/seo.ts trackSeo)
        seoTitle: fields.text({ label: 'SEO — title' }),
        seoDescription: fields.text({ label: 'SEO — description', multiline: true }),
        ogRole: fields.text({ label: 'OG image — role line' }),
        ogTagline: fields.text({ label: 'OG image — tagline' }),
        // About (markdown; **bold** renders as the accent colour)
        aboutLead: fields.text({
          label: 'About — lead paragraph (markdown; **bold** = accent)',
          multiline: true,
        }),
        aboutBody: fields.text({ label: 'About — body paragraph (markdown)', multiline: true }),
        aboutStack: stringList('About — stack', 'Tech'),
        aboutInterests: stringList('About — interests', 'Interest'),
        // Ordered featured projects with optional per-track overrides
        featuredProjects: fields.array(
          fields.object({
            project: fields.relationship({ label: 'Project', collection: 'projects' }),
            roleOverride: fields.text({ label: 'Role override (optional)', multiline: true }),
            outcomeOverride: fields.text({ label: 'Outcome override (optional)', multiline: true }),
            stackOverride: stringList('Stack override (optional)', 'Tech'),
          }),
          {
            label: 'Featured projects (ordered)',
            itemLabel: (p) => p.fields.project.value || 'project',
          },
        ),
        // Per-track tech-depth. Leave empty to fall back to the shared list.
        techDepth: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            context: fields.text({ label: 'Context (system/project)' }),
            body: fields.text({ label: 'Body', multiline: true }),
            tags: stringList('Tags', 'Tag'),
            href: fields.text({ label: 'Write-up link (optional)' }),
          }),
          {
            label: 'Tech depth (leave empty to use shared)',
            itemLabel: (p) => p.fields.title.value || 'item',
          },
        ),
      },
    }),

    // ── Hackathons ──
    hackathons: collection({
      label: 'Hackathons',
      slugField: 'event',
      path: 'content/hackathons/*',
      format: { data: 'yaml' },
      columns: ['event'],
      schema: {
        event: fields.slug({
          name: { label: 'Event', validation: { length: { min: 1 } } },
        }),
        order: fields.integer({ label: 'Order', defaultValue: 0 }),
        project: fields.text({ label: 'Project' }),
        status: fields.text({ label: 'Status (e.g. "Won · presented")' }),
        built: fields.text({ label: 'What was built', multiline: true }),
        stack: stringList('Stack', 'Tech'),
        accent: accentField,
      },
    }),

    // ── Writing (engineering write-ups) ──
    writing: collection({
      label: 'Writing',
      slugField: 'title',
      path: 'content/writing/*',
      format: { data: 'yaml' },
      columns: ['title'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { length: { min: 1 } } },
        }),
        project: fields.text({ label: 'Source system/project' }),
        dek: fields.text({ label: 'Dek (one-line summary)', multiline: true }),
        readingMinutes: fields.integer({ label: 'Reading minutes', defaultValue: 5 }),
        ownerVerify: fields.text({
          label: 'Draft banner — owner verification note (leave empty to hide)',
          multiline: true,
        }),
        sections: fields.array(
          fields.object({
            heading: fields.text({ label: 'Heading' }),
            paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
              label: 'Paragraphs',
              itemLabel: (p) => (p.value || '').slice(0, 60) || 'paragraph',
            }),
          }),
          {
            label: 'Sections',
            itemLabel: (p) => p.fields.heading.value || 'section',
          },
        ),
      },
    }),
  },

  singletons: {
    // ── The 3 shared tech-depth items (general/backend read these) ──
    sharedTechDepth: singleton({
      label: 'Shared tech depth',
      path: 'content/shared-tech-depth',
      format: { data: 'yaml' },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            context: fields.text({ label: 'Context' }),
            body: fields.text({ label: 'Body', multiline: true }),
            tags: stringList('Tags', 'Tag'),
            href: fields.text({ label: 'Write-up link (optional)' }),
          }),
          {
            label: 'Shared tech-depth items',
            itemLabel: (p) => p.fields.title.value || 'item',
          },
        ),
      },
    }),

    // ── Site-wide fields (name, contact, nav, socials) ──
    site: singleton({
      label: 'Site',
      path: 'content/site',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Name' }),
        handle: fields.text({ label: 'Handle' }),
        role: fields.text({ label: 'Shared role/title' }),
        valueProp: fields.text({ label: 'Value prop', multiline: true }),
        location: fields.text({ label: 'Location' }),
        email: fields.text({ label: 'Email' }),
        resumeUrl: fields.text({ label: 'Resume page path' }),
        resumeFile: fields.text({ label: 'Resume file path' }),
        ogImage: fields.text({ label: 'Fallback OG image path' }),
        hackathonsIntro: fields.text({ label: 'Hackathons section intro', multiline: true }),
        navLinks: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Href' }),
          }),
          { label: 'Nav links', itemLabel: (p) => p.fields.label.value || 'link' },
        ),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            href: fields.text({ label: 'Href' }),
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'GitHub', value: 'github' },
                { label: 'Email', value: 'email' },
                { label: 'LinkedIn', value: 'linkedin' },
              ],
              defaultValue: 'github',
            }),
          }),
          { label: 'Socials', itemLabel: (p) => p.fields.label.value || 'social' },
        ),
      },
    }),
  },
});
