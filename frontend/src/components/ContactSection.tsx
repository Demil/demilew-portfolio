'use client';

import { useEffect, useState } from 'react';
import { submitContact, getCvInfo, CvInfo } from '@/lib/api';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, MapPin, Clock, FileText, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface ContactSectionProps {
  cvInfo?: CvInfo | null;
}

export default function ContactSection({ cvInfo: initialCvInfo }: ContactSectionProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvInfo, setCvInfo] = useState<CvInfo | null>(initialCvInfo || null);

  useEffect(() => {
    if (initialCvInfo !== undefined) {
      setCvInfo(initialCvInfo);
    } else {
      getCvInfo().then(setCvInfo).catch(() => { });
    }
  }, [initialCvInfo]);

  useEffect(() => {
    const handleSetInquiry = (event: Event) => {
      const customEvent = event as CustomEvent<{ subject?: string; messagePrefix?: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          subject: customEvent.detail.subject || prev.subject,
          message: customEvent.detail.messagePrefix
            ? `${customEvent.detail.messagePrefix}\n\n${prev.message}`.trim()
            : prev.message,
        }));
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const messageEl = document.getElementById('message');
            messageEl?.focus();
          }, 400);
        }
      }
    };

    window.addEventListener('set-contact-inquiry', handleSetInquiry);
    return () => {
      window.removeEventListener('set-contact-inquiry', handleSetInquiry);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitContact(formData);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setError(result.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-[var(--border-subtle)] gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4" /> {t.contact.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.contact.heading}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Minimal Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {t.nav.letsTalk}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Whether you represent an admissions committee, AI research lab, tech organization, or enterprise looking for senior engineering talent, my inbox is open.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Mail className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">{t.contact.directChannels}</span>
                  <a
                    href="mailto:contact@demilewterefe.com"
                    className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors font-medium text-sm"
                  >
                    contact@demilewterefe.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Location</span>
                  <span className="text-[var(--text-secondary)]">{t.contact.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Typical Response Time</span>
                  <span className="text-[var(--text-secondary)]">Within 24 to 48 business hours</span>
                </div>
              </div>

              {/* CV Download Desk Card */}
              {cvInfo && (
                <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center gap-2.5 text-[var(--accent-primary)]">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-tight text-[var(--text-primary)]">Curriculum Vitae</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-mono truncate">
                    {cvInfo.filename} ({Math.round(cvInfo.file_size_bytes / 1024)} KB)
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`${API_BASE_URL}/profile/cv/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--accent-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.hero.viewCv}</span>
                    </a>
                    <a
                      href={`${API_BASE_URL}/profile/cv/download?download=1`}
                      download={cvInfo.filename}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.hero.downloadCv}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 sm:p-8 shadow-sm">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  {t.contact.successMessage}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-prominent)] text-xs font-mono font-medium transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5"
                    >
                      {t.contact.name} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Alex Mercer"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-prominent)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5"
                    >
                      {t.contact.email} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex.mercer@institution.org"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-prominent)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5"
                  >
                    {t.contact.subject} *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Research Collaboration / Software Engineering Opportunity"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-prominent)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5"
                  >
                    {t.contact.message} *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide relevant context regarding your team, inquiry, or research proposal..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-prominent)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-y"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.contact.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contact.send}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
