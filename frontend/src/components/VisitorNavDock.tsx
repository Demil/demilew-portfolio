'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronUp, Layers, Briefcase, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SECTIONS = [
  { id: 'about', labelEn: 'About', labelAm: 'ስለ እኔ', num: '01' },
  { id: 'services', labelEn: 'Services', labelAm: 'አገልግሎቶች', num: '02' },
  { id: 'projects', labelEn: 'Projects', labelAm: 'ፕሮጀክቶች', num: '03' },
  { id: 'research', labelEn: 'Research', labelAm: 'ጥናቶች', num: '04' },
  { id: 'skills', labelEn: 'Skills', labelAm: 'ክህሎቶች', num: '05' },
  { id: 'experience', labelEn: 'Experience', labelAm: 'ልምድ', num: '06' },
  { id: 'contact', labelEn: 'Contact', labelAm: 'አግኙኝ', num: '07' },
];

export default function VisitorNavDock() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('about');
  const [dockExpanded, setDockExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dock after scrolling down 280px
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Check active section
      const scrollPosition = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSectionId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const currentSection = SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];
  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSectionId);
  const currentLabel = language === 'am' ? currentSection.labelAm : currentSection.labelEn;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setDockExpanded(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDockExpanded(false);
  };

  const nextSection = SECTIONS[currentIndex + 1];
  const prevSection = SECTIONS[currentIndex - 1];

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-300">
      {/* Expanded Quick-Jump Menu */}
      {dockExpanded && (
        <div className="mb-2 p-2 bg-[var(--bg-surface-elevated)]/95 backdrop-blur-md border border-[var(--border-prominent)] rounded-xl shadow-xl space-y-1 animate-in fade-in slide-in-from-bottom-2 min-w-[200px]">
          <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)] flex items-center justify-between">
            <span>{language === 'am' ? 'የይዘት ማውጫ' : 'Quick Navigation'}</span>
            <span className="text-[var(--accent-primary)] font-semibold">{currentSection.num} / 07</span>
          </div>
          {SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            const label = language === 'am' ? sec.labelAm : sec.labelEn;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-tertiary)]">{sec.num}</span>
                  <span>{label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating Pill Controller */}
      <div className="inline-flex items-center gap-1 p-1 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-subtle)] rounded-full shadow-lg text-xs font-mono">
        {/* Active Section Trigger / Toggle */}
        <button
          onClick={() => setDockExpanded(!dockExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all"
          title="Toggle Navigation Menu"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]" />
          </span>
          <span className="font-semibold text-[11px] tracking-tight">{currentLabel}</span>
          <span className="text-[10px] text-[var(--text-tertiary)]">({currentSection.num})</span>
        </button>

        {/* Quick Prev Section */}
        {prevSection && (
          <button
            onClick={() => scrollToSection(prevSection.id)}
            className="p-1.5 rounded-full hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={`Previous: ${language === 'am' ? prevSection.labelAm : prevSection.labelEn}`}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Quick Next Section */}
        {nextSection && (
          <button
            onClick={() => scrollToSection(nextSection.id)}
            className="p-1.5 rounded-full hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title={`Next: ${language === 'am' ? nextSection.labelAm : nextSection.labelEn}`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-1.5 rounded-full hover:bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] transition-colors ml-0.5"
          title="Scroll to Top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

