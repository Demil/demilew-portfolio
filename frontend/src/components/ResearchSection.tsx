'use client';

import { Research } from '@/types/portfolio';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResearchSectionProps {
  research: Research[];
}

export default function ResearchSection({ research }: ResearchSectionProps) {
  const { t } = useLanguage();

  if (!research || research.length === 0) return null;

  return (
    <section id="research" className="py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-[var(--border-subtle)] gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {t.research.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.research.heading}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.research.subtitle}
          </p>
        </div>

        {/* Academic Research Index Rows */}
        <div className="space-y-6">
          {research.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-prominent)] transition-colors space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--accent-primary)]">
                      INDEX 0{idx + 1}
                    </span>
                    <span className="text-[var(--border-prominent)] font-mono text-xs">•</span>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {idx === 0
                        ? 'Network Anomaly Detection & AI Security'
                        : idx === 1
                          ? 'Privacy-Preserving Federated Learning'
                          : 'Low-Resource Natural Language Processing'}
                    </span>
                  </div>

                  {item.publication_url && (
                    <a
                      href={item.publication_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>{t.research.viewPaper}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-1">
                  <div className="lg:col-span-7 space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.methodology && (
                    <div className="lg:col-span-5 p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold block">
                        {t.research.methodology}:
                      </span>
                      <p className="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                        {item.methodology}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
