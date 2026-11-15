'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { Project } from '@/types/portfolio';
import { ArrowUpRight, FolderGit2, Shield, Network, Database, Cpu, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'intrusion' | 'deepfake' | 'rag'>('all');

  if (!projects || projects.length === 0) return null;

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'intrusion') return project.slug.includes('intrusion');
    if (activeCategory === 'deepfake') return project.slug.includes('deepfake');
    if (activeCategory === 'rag') return project.slug.includes('dashen') || project.slug.includes('rag');
    return true;
  });

  return (
    <section id="projects" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" /> {t.projects.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.projects.heading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Category Exploration Filters with Mobile Horizontal Swipe */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${activeCategory === 'all'
                ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
          >
            All Projects ({projects.length.toString().padStart(2, '0')})
          </button>
          <button
            onClick={() => setActiveCategory('intrusion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${activeCategory === 'intrusion'
                ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
          >
            Intrusion Defense
          </button>
          <button
            onClick={() => setActiveCategory('deepfake')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${activeCategory === 'deepfake'
                ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
          >
            Deepfake &amp; Privacy
          </button>
          <button
            onClick={() => setActiveCategory('rag')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${activeCategory === 'rag'
                ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
          >
            Document Search &amp; RAG
          </button>
        </div>

        {/* Featured Projects Editorial List */}
        <div className="space-y-8 sm:space-y-12">
          {filteredProjects.map((project, idx) => {
            const isZeroDay = project.slug.includes('intrusion');
            const isDeepfake = project.slug.includes('deepfake');

            const statusBadge = isZeroDay
              ? 'Evaluated on NSL-KDD / CICIDS'
              : isDeepfake
                ? 'Privacy-Preserving Prototype'
                : 'Enterprise Document RAG';

            const contribution = isZeroDay
              ? '1D-CNN temporal-spatial hybrid model architecture, hyperparameter optimization, and benchmark evaluation.'
              : isDeepfake
                ? 'Federated node aggregation protocol, Differential Privacy (ε-budget) calibration, and biometric protection.'
                : 'Dense semantic cross-lingual retrieval, Ethiopic tokenization adaptation, and FastAPI backend integration.';

            return (
              <ScrollReveal key={project.id} delay={idx * 130}>
                <article
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start p-4 sm:p-6 lg:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all shadow-sm interactive-card"
                >
                  {/* Left Meta & Index Column */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--accent-primary)] px-2 py-0.5 rounded bg-[var(--accent-subtle)] border border-[var(--border-subtle)]">
                        PROJECT 0{idx + 1}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                        {statusBadge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="hover:text-[var(--accent-primary)] transition-colors"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    {/* Tech Stack Pills */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
                        {t.projects.stack}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-2.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] interactive-pill"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2 sm:pt-4 flex items-center gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group inline-flex items-center justify-center gap-1.5 text-xs font-mono font-semibold px-4 py-2.5 min-h-[42px] rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-[#090b10] border border-[var(--border-prominent)] hover:border-[var(--accent-primary)] transition-all shadow-xs interactive-btn active:scale-95"
                      >
                        <span>{t.projects.viewCaseStudy}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors p-2.5 min-h-[42px] min-w-[42px] flex items-center justify-center rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 interactive-btn active:scale-95"
                          title={t.projects.sourceCode}
                          aria-label={t.projects.sourceCode}
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Context & Architecture Details */}
                  <div className="lg:col-span-7 space-y-4 lg:pl-6 lg:border-l lg:border-[var(--border-subtle)]">
                    {/* Overview Description */}
                    <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Problem Statement Box */}
                    {project.problem_statement && (
                      <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                          {isZeroDay ? (
                            <Network className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          ) : isDeepfake ? (
                            <Shield className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          ) : (
                            <Database className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          )}
                          {t.projects.problem}
                        </span>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {project.problem_statement}
                        </p>
                      </div>
                    )}

                    {/* Technical Approach Box */}
                    {project.technical_approach && (
                      <div className="p-4 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          {t.projects.approach}
                        </span>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                          {project.technical_approach}
                        </p>
                      </div>
                    )}

                    {/* Demilew's Contribution */}
                    <div className="p-3.5 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/20 space-y-1">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        Engineering Contribution
                      </span>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                        {contribution}
                      </p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
