'use client';

import React, { useEffect, useState } from 'react';
import { CvInfo } from '@/types/portfolio';
import { getCvInfo, DEFAULT_CV_INFO } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Download, ExternalLink, X } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface CvNotificationBannerProps {
  cvInfo?: CvInfo | null;
}

export default function CvNotificationBanner({ cvInfo: initialCvInfo }: CvNotificationBannerProps) {
  const { t } = useLanguage();
  const [cvInfo, setCvInfo] = useState<CvInfo | null>(initialCvInfo || DEFAULT_CV_INFO);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (initialCvInfo) {
      setCvInfo(initialCvInfo);
    } else {
      getCvInfo().then(setCvInfo).catch(() => { });
    }

    try {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      if (isMobile || sessionStorage.getItem('demilew_cv_banner_dismissed') === 'true') {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, [initialCvInfo]);

  if (!cvInfo) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('demilew_cv_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleRestore = () => {
    setDismissed(false);
    try {
      sessionStorage.removeItem('demilew_cv_banner_dismissed');
    } catch {
      // ignore
    }
  };

  const downloadUrl = `${API_BASE_URL}/profile/cv/download`;

  return (
    <aside
      aria-label="Curriculum Vitae Notification"
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 max-w-sm w-full px-3 sm:px-0 pointer-events-none"
    >
      {/* ── Minimized Floating Action Pill (When Dismissed) ── */}
      {dismissed ? (
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={handleRestore}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] shadow-2xl text-xs font-mono text-[var(--text-primary)] transition-all hover:scale-105"
            title="Open Curriculum Vitae notice"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-primary)]" />
            </span>
            <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="font-semibold">CV</span>
            <span className="text-[10px] text-[var(--text-tertiary)] hidden sm:inline">PDF</span>
          </button>
        </div>
      ) : (
        /* ── Expanded Executive Notification Card ── */
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto bg-[var(--bg-surface)] border border-[var(--border-prominent)] rounded-2xl p-4 shadow-2xl backdrop-blur-md space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Top Banner Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-[var(--accent-subtle)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent-primary)]" />
              </span>
              <span>{t.cvNotification.badge}</span>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-md"
              aria-label={t.cvNotification.dismiss}
              title={t.cvNotification.dismiss}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Content */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <span>{t.cvNotification.title}</span>
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t.cvNotification.description}
            </p>
            <div className="pt-0.5">
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] truncate block">
                {cvInfo.filename} ({Math.round(cvInfo.file_size_bytes / 1024)} KB)
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-cv-viewer'))}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] hover:opacity-90 text-[#090b10] text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.cvNotification.viewPdf}</span>
            </button>

            <a
              href={`${downloadUrl}?download=1`}
              download={cvInfo.filename}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors"
              title={t.cvNotification.download}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.cvNotification.download}</span>
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
