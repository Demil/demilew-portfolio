'use client';

import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { ArrowUpRight, FolderGit2, Shield, Network, Database } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { t } = useLanguage();

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-[var(--border-subtle)] gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <FolderGit2 className="w-4 h-4" /> {t.projects.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.projects.heading}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.projects.subtitle}
          </p>
        </div>

        {/* Featured Projects Editorial List */}
        <div className="space-y-12 sm:space-y-14">
          {projects.map((project, idx) => {
            const isZeroDay = project.slug.includes('intrusion');
            const isDeepfake = project.slug.includes('deepfake');

            return (
              <article
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 sm:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-prominent)] transition-colors shadow-sm"
              >
                {/* Left Meta & Index Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--accent-primary)] px-2 py-0.5 rounded bg-[var(--accent-subtle)] border border-[var(--border-subtle)]">
                      PROJECT 0{idx + 1}
                    </span>
                    {project.featured && (
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                        Featured Architecture
                      </span>
                    )}
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
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider block">
                      {t.projects.stack}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 flex items-center gap-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>{t.projects.viewCaseStudy}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        title={t.projects.sourceCode}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Context & Architecture Details */}
                <div className="lg:col-span-7 space-y-5 lg:pl-6 lg:border-l lg:border-[var(--border-subtle)]">
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
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)] block">
                        {t.projects.approach}
                      </span>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {project.technical_approach}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
