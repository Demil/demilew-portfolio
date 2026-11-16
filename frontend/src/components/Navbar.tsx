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
      const sections = ['about', 'projects', 'research', 'skills', 'experience', 'contact'];
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

  // Lock body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-base)]/90 border-b border-[var(--border-subtle)] transition-colors">
      {/* Top Hairline Reading Progress Bar with Brand Glow */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)] transition-all duration-150 ease-out z-50 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center font-bold text-xs font-mono tracking-tight shadow-sm transition-transform group-hover:scale-105">
            DT
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
            {language === 'am' ? 'ደምለው ተረፈ' : t.hero.headline}
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
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-cv-viewer'))}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            title="View Curriculum Vitae (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{t.nav.cv}</span>
          </button>

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
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] active:scale-95 transition-transform"
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
            className="min-h-[40px] px-2.5 flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono font-bold text-[var(--accent-primary)] active:scale-95 transition-transform"
            title="Toggle Language"
            aria-label="Toggle Language"
          >
            {language === 'en' ? 'አማ' : 'EN'}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-w-[42px] min-h-[42px] flex items-center justify-center rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] text-[var(--text-primary)] active:scale-95 transition-transform ml-0.5"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[var(--accent-primary)]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[var(--border-prominent)] bg-[var(--bg-base)]/98 backdrop-blur-xl px-5 py-5 flex flex-col gap-2 z-50 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] px-2 pb-1">
            Navigation Menu
          </div>

          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between text-sm font-mono min-h-[44px] py-2.5 px-3 rounded-lg border transition-all active:scale-[0.98] ${
                  isActive
                    ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-prominent)]'
                }`}
              >
                <span>{link.name}</span>
                {isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
                ) : (
                  <span className="text-[var(--text-tertiary)] text-xs">→</span>
                )}
              </a>
            );
          })}

          {/* Mobile CV Action Card */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new CustomEvent('open-cv-viewer'));
              }}
              className="w-full flex items-center justify-between min-h-[46px] px-3.5 py-2.5 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-mono text-sm font-semibold text-left cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>{t.hero.viewCv} (In-Site Viewer)</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-primary)] text-[#090b10] font-bold">PDF</span>
            </button>
          </div>

          {/* Quick Action Footer in Drawer */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] mt-2">
            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-2 text-xs font-mono font-semibold min-h-[42px] px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#090b10] active:scale-95 transition-transform shadow-sm"
            >
              <span>{t.nav.letsTalk}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] flex items-center gap-1.5 min-h-[42px] px-3 py-2 ml-2 rounded-lg border border-[var(--border-subtle)]"
              aria-label="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
