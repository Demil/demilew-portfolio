'use client';

import { Code2, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand stamp */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">
            Demilew Terefe
          </span>
          <span className="text-[var(--border-prominent)]">|</span>
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            {t.footer.rights} © {year}
          </span>
        </div>

        {/* Navigation Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[var(--text-secondary)]">
          <a href="/#about" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.about}
          </a>
          <a href="/#projects" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.projects}
          </a>
          <a href="/#research" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.research}
          </a>
          <a href="/#skills" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.skills}
          </a>
          <a href="/#experience" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.experience}
          </a>
          <a href="/#contact" className="hover:text-[var(--text-primary)] transition-colors">
            {t.nav.contact}
          </a>
        </div>

        {/* Channels */}
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:contact@demilewterefe.com"
            aria-label="Email"
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
