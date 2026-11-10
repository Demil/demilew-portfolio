import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center p-6 antialiased transition-colors">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)] mx-auto shadow-md">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
            404 Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Page Not Found
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The page or project case study you requested could not be located, or may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
