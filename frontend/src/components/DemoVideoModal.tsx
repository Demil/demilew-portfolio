'use client';

import React, { useEffect, useCallback } from 'react';
import { X, Play, ExternalLink, ShieldCheck } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  techStack?: string[];
}

export function getEmbedUrl(url: string | null | undefined): { type: 'iframe' | 'video' | 'invalid'; src: string } {
  if (!url) return { type: 'invalid', src: '' };

  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return {
      type: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Loom
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return {
      type: 'iframe',
      src: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct MP4 / WebM
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      type: 'video',
      src: trimmed,
    };
  }

  // Generic iframe fallback
  if (trimmed.startsWith('http')) {
    return {
      type: 'iframe',
      src: trimmed,
    };
  }

  return { type: 'invalid', src: '' };
}

export default function DemoVideoModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  liveUrl,
  githubUrl,
  techStack = [],
}: DemoVideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const embed = getEmbedUrl(videoUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]/60">
          <div className="space-y-1 min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-semibold border border-[var(--accent-primary)]/20">
                <Play className="w-3 h-3 fill-current" />
                Live System Walkthrough
              </span>
            </div>
            <h3
              id="demo-video-modal-title"
              className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight truncate"
            >
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
          {embed.type === 'iframe' && (
            <iframe
              src={embed.src}
              title={`${title} Demo Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          )}

          {embed.type === 'video' && (
            <video
              src={embed.src}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          )}

          {embed.type === 'invalid' && (
            <div className="p-8 text-center max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] flex items-center justify-center mx-auto shadow-md">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  Demo Walkthrough Video Preview
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The author has configured this project demo slot. You can explore the full technical approach, architecture details, or live repository below.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs font-semibold"
                  >
                    <span>Launch Live App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Quick Architecture Summary */}
        <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--text-tertiary)] font-mono text-[11px] mr-1">Stack:</span>
            {techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-mono text-[11px]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-[#090b10] font-semibold text-xs interactive-btn shadow-xs"
              >
                <span>Live App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-medium transition-colors"
              >
                <span>Code</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
