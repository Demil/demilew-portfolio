'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { Project } from '@/types/portfolio';
import {
  ArrowUpRight,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t, language } = useLanguage();

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />{' '}
                {language === 'am' ? 'ፕሮጀክቶች' : t.projects.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                {language === 'am' ? 'የእኔ ፕሮጀክቶች' : 'My Projects'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              {language === 'am'
                ? 'በኤአይ ደህንነት፣ ፈጣን የባክኤንድ አርክቴክቸር እና ጥብቅ የምህንድስና ደረጃዎች የተገነቡ እውነተኛ ስርዓቶች።'
                : 'Production-ready systems embodying practical expertise in AI security, zero-day threat defense, and scalable FastAPI backend architectures.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Projects Clean Editorial List */}
        <div className="space-y-6 sm:space-y-8">
          {projects.map((project, idx) => {
            const isZeroDay = project.slug.includes('intrusion');
            const isDeepfake = project.slug.includes('deepfake');

            const statusBadge = isZeroDay
              ? 'Evaluated on NSL-KDD / CICIDS'
              : isDeepfake
                ? 'Privacy-Preserving Prototype'
                : 'Enterprise Document RAG';

            const highlight = isZeroDay
              ? 'Hybrid 1D-CNN + LSTM architecture achieving 99.2% zero-day detection with 0.12% false-alarm rate.'
              : isDeepfake
                ? 'Federated node aggregation protocol with Differential Privacy (ε-budget) calibration for biometric defense.'
                : 'Dense semantic cross-lingual retrieval with Ethiopic tokenization and FastAPI asynchronous inference.';

            return (
              <ScrollReveal key={project.id} delay={idx * 100}>
                <article
                  className="p-5 sm:p-7 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 transition-all duration-200 shadow-sm interactive-card"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
                    {/* Left Meta & Identity */}
                    <div className="lg:col-span-5 space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--accent-primary)] px-2.5 py-0.5 rounded bg-[var(--accent-subtle)] border border-[var(--border-subtle)]">
                          PROJECT 0{idx + 1}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
                          {statusBadge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {project.title}
                        </Link>
                      </h3>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 flex items-center gap-2.5">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="group inline-flex items-center justify-center gap-1.5 text-xs font-mono font-semibold px-4 py-2 min-h-[40px] rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--accent-primary)] text-[var(--accent-primary)] hover:text-[#090b10] border border-[var(--border-prominent)] hover:border-[var(--accent-primary)] transition-all shadow-xs interactive-btn active:scale-95"
                        >
                          <span>{t.projects.viewCaseStudy}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 interactive-btn active:scale-95"
                            title={t.projects.sourceCode}
                            aria-label={t.projects.sourceCode}
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right Unified Architecture & Highlights */}
                    <div className="lg:col-span-7 space-y-3.5 lg:pl-6 lg:border-l lg:border-[var(--border-subtle)]">
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.description}
                      </p>

                      {/* Clean Problem & Approach Summary */}
                      {project.problem_statement && (
                        <div className="text-xs text-[var(--text-tertiary)] leading-relaxed pt-1">
                          <strong className="text-[var(--text-secondary)] font-medium">Core Challenge: </strong>
                          {project.problem_statement}
                        </div>
                      )}

                      {/* Technical Innovation Highlight */}
                      <div className="p-3 rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/20 flex items-start gap-2.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <span className="text-[var(--text-primary)] leading-relaxed font-medium">
                          {highlight}
                        </span>
                      </div>
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
