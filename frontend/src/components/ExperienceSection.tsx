'use client';

import { Education, Experience } from '@/types/portfolio';
import { Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ExperienceSectionProps {
  experiences: Experience[];
  education: Education[];
}

function formatDate(dateStr: string): string {
  try {
    const [year, month] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ExperienceSection({
  experiences,
  education,
}: ExperienceSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-[var(--border-subtle)] gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {t.experience.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.experience.heading}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.experience.subtitle}
          </p>
        </div>

        {/* Dual Parallel Dossier Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Column 1: Professional Experience */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-base border-b border-[var(--border-subtle)] pb-3">
              <Briefcase className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>{t.experience.workHistory}</span>
            </div>

            <div className="space-y-10 pl-2">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l border-[var(--border-prominent)] space-y-2 group">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--accent-primary)]" />

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-mono text-[var(--text-tertiary)] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[var(--text-tertiary)]" />
                      {formatDate(exp.start_date)} —{' '}
                      {exp.is_current || !exp.end_date
                        ? t.experience.present
                        : formatDate(exp.end_date)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[var(--accent-primary)] font-mono">
                    {exp.company}
                  </p>

                  {exp.description && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Academic Credentials */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold text-base border-b border-[var(--border-subtle)] pb-3">
              <GraduationCap className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>{t.experience.education}</span>
            </div>

            <div className="space-y-10 pl-2">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6 border-l border-[var(--border-prominent)] space-y-3 group">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--accent-primary)]" />

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                      {edu.degree} in {edu.field}
                    </h3>
                    <span className="text-xs font-mono text-[var(--text-tertiary)]">
                      {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Graduated'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {edu.institution}
                  </p>

                  {edu.cgpa && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-xs font-mono text-[var(--text-primary)]">
                      <Award className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>Distinction: CGPA {edu.cgpa} / 4.00</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
