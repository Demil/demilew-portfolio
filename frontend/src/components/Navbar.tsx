'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Lock, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.nav.about, href: '/#about', id: 'about' },
    { name: t.nav.services, href: '/#services', id: 'services' },
    { name: t.nav.projects, href: '/#projects', id: 'projects' },
    { name: t.nav.research, href: '/#research', id: 'research' },
    { name: t.nav.skills, href: '/#skills', id: 'skills' },
    { name: t.nav.experience, href: '/#experience', id: 'experience' },
    { name: t.nav.contact, href: '/#contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // 1. Reading progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // 2. Active section ScrollSpy
      const sections = ['about', 'services', 'projects', 'research', 'skills', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-base)]/85 border-b border-[var(--border-subtle)] transition-colors">
      {/* Top Hairline Reading Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-[var(--accent-primary)] transition-all duration-150 ease-out z-50 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs font-mono tracking-tight shadow-sm transition-transform group-hover:scale-105">
            DT
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
            {t.hero.headline}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-2.5 py-1 rounded-md text-xs font-mono tracking-tight transition-all duration-150 ${
                  isActive
                    ? 'text-[var(--accent-primary)] font-semibold bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {link.name}
              </a>
            );
          })}

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-1" />

          {/* Language Switcher Pill */}
          <div className="flex items-center border border-[var(--border-subtle)] rounded-lg p-0.5 bg-[var(--bg-surface)] text-xs font-mono">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'en'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('am')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'am'
                  ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="አማርኛ (Amharic)"
            >
              አማ
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-prominent)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
            )}
          </button>

          {/* CV Direct Access */}
          <a
            href={`${API_BASE_URL}/profile/cv/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-secondary)] transition-colors"
            title="View Curriculum Vitae (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{t.nav.cv}</span>
          </a>

          {/* Let's Talk CTA */}
          <a
            href="/#contact"
            className="flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-prominent)] transition-colors"
          >
            <span>{t.nav.letsTalk}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          </a>

          {/* Admin Portal Shortcut */}
          <Link
            href="/admin"
            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            title={t.nav.adminPortal}
            aria-label={t.nav.adminPortal}
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Mobile Action Controls & Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
            )}
          </button>

          {/* Mobile Language Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono font-semibold text-[var(--accent-primary)]"
            title="Toggle Language"
          >
            {language === 'en' ? 'አማ' : 'EN'}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/98 backdrop-blur-lg px-6 py-5 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm font-mono py-2 px-2 rounded-lg border-b border-[var(--border-subtle)] transition-colors ${
                  isActive
                    ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                )}
              </a>
            );
          })}

          {/* Mobile CV Link */}
          <a
            href={`${API_BASE_URL}/profile/cv/download`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-mono text-[var(--accent-primary)] hover:underline flex items-center gap-2 py-2 px-2 border-b border-[var(--border-subtle)]"
          >
            <FileText className="w-4 h-4" />
            <span>{t.hero.viewCv} (PDF)</span>
          </a>

          <div className="flex items-center justify-between pt-2">
            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 text-xs font-mono font-medium px-4 py-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-prominent)]"
            >
              <span>{t.nav.letsTalk}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            </a>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 p-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.nav.adminPortal}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
