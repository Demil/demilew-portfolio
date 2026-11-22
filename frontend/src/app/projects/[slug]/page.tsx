import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ExternalLink, ShieldCheck, Terminal, Cpu, Play, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { getEmbedUrl } from '@/components/DemoVideoModal';

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
            {/* Live System Demonstration & Video Walkthrough */}
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-md">
              <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                    <Play className="w-4 h-4 fill-current" />
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                      System Demonstration &amp; Live Walkthrough
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Practical telemetry, execution logs, and live behavioral evaluation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs font-semibold shadow-xs interactive-btn active:scale-95"
                    >
                      <span>Interactive Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-medium"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Player Container */}
              {project.demo_video_url ? (
                (() => {
                  const embed = getEmbedUrl(project.demo_video_url);
                  return (
                    <div className="w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
                      {embed.type === 'iframe' && (
                        <iframe
                          src={embed.src}
                          title={`${project.title} Video Walkthrough`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      )}
                      {embed.type === 'video' && (
                        <video
                          src={embed.src}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      )}
                      {embed.type === 'invalid' && (
                        <div className="p-8 text-center text-xs text-slate-400">
                          Video preview unavailable. Verify demo URL format in Admin Portal.
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 sm:p-10 text-center bg-gradient-to-b from-[var(--bg-surface-elevated)]/30 to-[var(--bg-surface)] space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] flex items-center justify-center mx-auto">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      Screencast &amp; Demonstration Slot
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
                      This project supports direct video demonstrations via Loom, YouTube, or MP4. You can configure and update the demo stream from the Admin Dashboard at any time.
                    </p>
                  </div>
                  {project.live_url && (
                    <div className="pt-2">
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs font-semibold shadow-xs"
                      >
                        <span>Launch Live System</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

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
