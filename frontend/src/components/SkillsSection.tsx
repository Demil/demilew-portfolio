'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Skill } from '@/types/portfolio';
import { Cpu, Terminal, Server, ShieldCheck, Layout, Smartphone, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SkillsSectionProps {
  skills: Skill[];
}

interface DomainConfig {
  icon: typeof Server;
  description: string;
}

const DOMAIN_METADATA: Record<string, DomainConfig> = {
  backend: {
    icon: Server,
    description: 'High-performance microservices, REST APIs, ORM modeling, and relational database systems.',
  },
  frontend: {
    icon: Layout,
    description: 'Modern type-safe web interfaces, server components, and responsive design systems.',
  },
  devops: {
    icon: Terminal,
    description: 'Containerization, Linux environment automation, monorepo tooling, and CI/CD pipelines.',
  },
  'ai & machine learning': {
    icon: ShieldCheck,
    description: 'Applied machine learning architectures, intrusion detection, privacy frameworks, and NLP.',
  },
  'ai & security': {
    icon: ShieldCheck,
    description: 'Applied machine learning architectures, intrusion detection, privacy frameworks, and NLP.',
  },
  mobile: {
    icon: Smartphone,
    description: 'Cross-platform mobile client development, responsive UI, and offline-first workflows.',
  },
  other: {
    icon: Layers,
    description: 'Specialized tooling, scientific computing, system monitoring, and research utilities.',
  },
};

function getDomainMeta(categoryName: string): DomainConfig {
  const lower = categoryName.toLowerCase();
  for (const [key, meta] of Object.entries(DOMAIN_METADATA)) {
    if (lower.includes(key)) return meta;
  }
  return {
    icon: Cpu,
    description: 'Core engineering capabilities and specialized technical competencies.',
  };
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Dynamically extract categories from the API skills list
  const categoriesInDb = Array.from(new Set(skills.map((s) => s.category)));

  // Fallback domains if database has no skills seeded
  const fallbackCategories = ['Backend', 'AI & Security', 'DevOps', 'Frontend'];

  const categoriesToRender = categoriesInDb.length > 0 ? categoriesInDb : fallbackCategories;

  const getSkillsForCategory = (cat: string) => {
    const list = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase());
    return list.map((s) => s.name);
  };

  return (
    <section id="skills" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4" /> {t.skills.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.skills.heading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.skills.subtitle}
          </p>
        </div>

        {/* Category Filter Pills with Mobile Horizontal Swipe */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${
              selectedFilter === 'all'
                ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Skills
          </button>
          {categoriesToRender.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(selectedFilter === cat ? 'all' : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 min-h-[38px] transition-all active:scale-95 ${
                selectedFilter === cat
                  ? 'bg-[var(--accent-primary)] text-[#090b10] font-semibold shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Capability Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {(selectedFilter === 'all'
            ? categoriesToRender
            : categoriesToRender.filter((cat) => cat.toLowerCase().includes(selectedFilter.toLowerCase()))
          ).map((cat, idx) => {
            const meta = getDomainMeta(cat);
            const Icon = meta.icon;
            const categorySkills = getSkillsForCategory(cat);

            return (
              <ScrollReveal key={cat} delay={idx * 70} className="h-full">
                <div
                  className="space-y-4 sm:space-y-5 p-4 sm:p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 flex flex-col justify-between h-full transition-all shadow-sm interactive-card"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 text-[var(--accent-primary)]">
                      <Icon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                        {cat}
                      </h3>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed min-h-[36px]">
                      {meta.description}
                    </p>

                    <div className="pt-2 border-t border-[var(--border-subtle)]">
                      {categorySkills.length === 0 ? (
                        <p className="text-xs text-[var(--text-tertiary)] italic py-2">No skills registered.</p>
                      ) : (
                        <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
                          {categorySkills.map((name) => (
                            <li key={name} className="flex items-start gap-2">
                              <span className="text-[var(--accent-primary)] text-[10px] mt-0.5">•</span>
                              <span className="leading-tight">{name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-tertiary)] flex items-center justify-between">
                    <span>
                      {categorySkills.length} {t.skills.skillsCount}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
