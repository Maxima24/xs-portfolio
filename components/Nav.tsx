'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { navLinks, site } from '@/data/site';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="font-mono text-xl font-bold tracking-widest text-glow-cyan"
          aria-label="Home — XS"
        >
          XS
        </a>

        {/* desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-underline text-sm text-white/75 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href={site.resumeUrl}
            className="rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-sm font-medium text-neon-cyan shadow-glow-cyan transition-all hover:-translate-y-0.5 hover:bg-neon-cyan/20 hover:shadow-glow-cyan-lg"
          >
            Resume
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 text-white/80 md:hidden"
        >
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </div>
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`absolute inset-x-0 top-16 origin-top border-b border-white/10 bg-ink/95 backdrop-blur-md transition-all duration-300 ${
            open ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-1 px-5 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/5 hover:text-neon-cyan"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={site.resumeUrl}
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-3 text-center text-base font-medium text-neon-cyan"
              >
                Resume
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
