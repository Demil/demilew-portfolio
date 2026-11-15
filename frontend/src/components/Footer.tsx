'use client';

import { Code2, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t, language } = useLanguage();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] py-10 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand stamp */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-center">
          <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)]">
            {language === 'am' ? 'ደምለው ተረፈ' : 'Demilew Terefe'}
          </span>
          <span className="text-[var(--border-prominent)]">|</span>
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            {t.footer.rights} © {year}
          </span>
        </div>

        {/* Navigation Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono text-[var(--text-secondary)]">
          <a href="/#about" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.about}
          </a>
          <a href="/#services" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.services}
          </a>
          <a href="/#projects" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.projects}
          </a>
          <a href="/#research" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.research}
          </a>
          <a href="/#skills" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.skills}
          </a>
          <a href="/#experience" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.experience}
          </a>
          <a href="/#contact" className="hover:text-[var(--text-primary)] transition-colors py-1">
            {t.nav.contact}
          </a>
        </div>

        {/* Channels */}
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <a
            href="https://www.linkedin.com/in/demilew-terefe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/Demil"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:demilew05terefe@gmail.com"
            aria-label="Email"
            className="hover:text-[var(--text-primary)] transition-colors p-1"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
