'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export default function CvViewerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-cv-viewer', handleOpen);
    window.addEventListener('close-cv-viewer', handleClose);

    return () => {
      window.removeEventListener('open-cv-viewer', handleOpen);
      window.removeEventListener('close-cv-viewer', handleClose);
    };
  }, []);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const cvUrl = `${API_BASE_URL}/profile/cv/download`;
  const downloadUrl = `${API_BASE_URL}/profile/cv/download?download=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-prominent)] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col h-[92vh] max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-3.5 py-3 sm:px-5 sm:py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center shrink-0 border border-[var(--accent-primary)]/20">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 id="cv-modal-title" className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] tracking-tight truncate">
                {language === 'am' ? 'ደምለው ተረፈ — CV' : 'Demilew Terefe — CV'}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono text-[var(--text-tertiary)] truncate">
                Verified Document • 73 KB PDF
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={downloadUrl}
              download="Demilew_Terefe_CV.pdf"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs font-semibold hover:opacity-90 transition-opacity interactive-btn shadow-xs active:scale-95"
              title="Download PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.hero.downloadCv}</span>
            </a>

            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors active:scale-95"
              title="Open in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors ml-0.5 active:scale-95"
              aria-label="Close CV Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Assistive Banner */}
        <div className="sm:hidden px-4 py-2 bg-[var(--accent-subtle)] border-b border-[var(--accent-primary)]/20 flex items-center justify-between text-[11px] text-[var(--text-primary)]">
          <span className="text-[var(--text-secondary)]">Mobile document view</span>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent-primary)] flex items-center gap-1 active:scale-95"
          >
            <span>Open Fullscreen</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Embedded PDF Viewer Frame */}
        <div className="relative flex-1 w-full bg-[#1a1d24] overflow-hidden min-h-[350px]">
          <iframe
            src={`${cvUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-none"
            title="Demilew Terefe CV Document Preview"
          />
        </div>

        {/* Modal Footer Note */}
        <div className="px-4 sm:px-5 py-2 sm:py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between text-[10px] sm:text-[11px] text-[var(--text-tertiary)] font-mono shrink-0">
          <span>In-Site Document Viewer</span>
          <span className="hidden sm:inline text-[10px] text-[var(--text-tertiary)]">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">ESC</kbd> or click outside to close
          </span>
          <span className="sm:hidden text-[10px] text-[var(--text-tertiary)]">
            Tap outside to close
          </span>
        </div>
      </div>
    </div>
  );
}
