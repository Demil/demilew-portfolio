'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Research } from '@/types/portfolio';
import { BookOpen, ExternalLink, ChevronDown, ChevronUp, Cpu, Binary, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResearchSectionProps {
  research: Research[];
}

export default function ResearchSection({ research }: ResearchSectionProps) {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!research || research.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const researchMeta = [
    {
      discipline: 'Network Anomaly Detection & AI Security',
      dataset: 'NSL-KDD, CICIDS2017 & Telemetry Flows',
      benchmarks: 'Zero-day detection precision, low-frequency attack sensitivity, false positive minimization',
      theoreticalBasis: '1D Convolutional Neural feature extraction cascaded into bidirectional LSTM temporal sequence units.',
    },
    {
      discipline: 'Privacy-Preserving Federated Learning',
      dataset: 'Distributed biometric media & FaceForensics++ subsets',
      benchmarks: 'ε-differential privacy bounds, gradient leakage defense, federated client aggregation efficiency',
      theoreticalBasis: 'Decentralized local model SGD with calibrated Laplace / Gaussian noise perturbation and clipping bounds.',
    },
    {
      discipline: 'Low-Resource Natural Language Processing',
      dataset: 'Ethiopic institutional corpora, Amharic legal/financial texts',
      benchmarks: 'Subword tokenization coverage, cross-lingual MRR (Mean Reciprocal Rank), RAG faithfulness',
      theoreticalBasis: 'Custom Byte-Pair Encoding (BPE) adapted for Ethiopic script, contrastive vector re-ranking with domain bi-encoders.',
    },
  ];

  return (
    <section id="research" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {t.research.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.research.heading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.research.subtitle}
          </p>
        </div>

        {/* Academic Research Index Rows */}
        <div className="space-y-5 sm:space-y-6">
          {research.map((item, idx) => {
            const meta = researchMeta[idx] || researchMeta[0];
            const isExpanded = expandedIndex === idx;

            return (
              <ScrollReveal key={item.id} delay={idx * 110}>
                <div
                  className="p-4 sm:p-6 lg:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all space-y-4 shadow-sm interactive-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <span className="text-xs font-mono font-bold text-[var(--accent-primary)] px-2 py-0.5 rounded bg-[var(--accent-subtle)] border border-[var(--border-subtle)]">
                        RESEARCH 0{idx + 1}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {meta.discipline}
                      </span>
                    </div>

                    {item.publication_url ? (
                      <a
                        href={item.publication_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors py-1"
                      >
                        <span>{t.research.viewPaper}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                        Applied Research Initiative
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start pt-1">
                    <div className="lg:col-span-7 space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => toggleExpand(idx)}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors py-2 min-h-[42px] active:scale-95"
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? 'Hide Technical Formulation' : 'View Theoretical Formulation & Datasets'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {item.methodology && (
                      <div className="lg:col-span-5 p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          {t.research.methodology}
                        </span>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {item.methodology}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expandable Technical Formulation Panel */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-[var(--border-subtle)] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in text-xs">
                      <div className="p-3.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                          <Binary className="w-3.5 h-3.5" /> Datasets &amp; Evaluation Benchmarks
                        </span>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                          {meta.dataset}
                        </p>
                        <p className="text-[var(--text-tertiary)] text-[11px] pt-1">
                          Target metrics: {meta.benchmarks}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> Theoretical &amp; Algorithmic Foundation
                        </span>
                        <p className="text-[var(--text-secondary)] leading-relaxed">
                          {meta.theoreticalBasis}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
