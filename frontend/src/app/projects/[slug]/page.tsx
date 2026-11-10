import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ExternalLink, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { GithubIcon } from '@/components/icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased transition-colors">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Return to Selected Works</span>
          </Link>

          {/* Project Header */}
          <div className="space-y-4 pb-8 border-b border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
                PROJECT #{project.display_order}
              </span>
              {project.featured && (
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Featured Systems Architecture
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {project.description}
            </p>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-[var(--text-primary)] text-xs font-mono transition-colors shadow-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--accent-primary)] text-xs font-mono transition-colors shadow-xs"
                >
                  <span>Live Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Architecture Content */}
          <div className="py-10 space-y-10">
            {/* Technologies */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[var(--accent-primary)]" /> Technology Stack &amp; Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            {project.problem_statement && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-3 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[var(--accent-primary)]" /> Problem Statement &amp; Domain Challenge
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
                  {project.problem_statement}
                </p>
              </div>
            )}

            {/* Technical Approach */}
            {project.technical_approach && (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-3 shadow-sm">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[var(--accent-primary)]" /> Architectural &amp; Algorithmic Approach
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
                  {project.technical_approach}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
