'use client';

import { useEffect, useState } from 'react';
import { submitContact, getCvInfo, CvInfo, DEFAULT_CV_INFO } from '@/lib/api';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, MapPin, Clock, Phone, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';

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
    <section id="contact" className="py-16 sm:py-24 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" /> {t.contact.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                {t.contact.heading}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              {t.contact.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* Minimal Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Information */}
          <ScrollReveal direction="left" delay={100} className="lg:col-span-5 space-y-5 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {t.nav.letsTalk}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Whether you have an upcoming software project, AI research inquiry, or career opportunity, feel free to reach out anytime.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 pt-1 text-xs font-mono">
              <div className="interactive-card flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Mail className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--text-tertiary)] block text-[11px]">{t.contact.directChannels}</span>
                  <a
                    href="mailto:demilew05terefe@gmail.com"
                    className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors font-medium text-xs sm:text-sm truncate block"
                  >
                    demilew05terefe@gmail.com
                  </a>
                </div>
              </div>

              <div className="interactive-card flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Phone className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div className="min-w-0 w-full">
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Direct Phone &amp; Channels</span>
                  <div className="flex flex-wrap items-center gap-2 font-medium text-xs sm:text-sm pt-0.5">
                    <a
                      href="tel:+251932045612"
                      className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors py-0.5"
                    >
                      +251 932 045 612
                    </a>
                    <span className="text-[var(--text-tertiary)]">/</span>
                    <a
                      href="tel:+251953229831"
                      className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors py-0.5"
                    >
                      +251 953 229 831
                    </a>
                  </div>
                </div>
              </div>

              <div className="interactive-card flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Globe className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Social Profiles</span>
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <a
                      href="https://www.linkedin.com/in/demilew-terefe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors font-medium py-0.5"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                    <span className="text-[var(--text-tertiary)]">•</span>
                    <a
                      href="https://github.com/Demil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors font-medium py-0.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="interactive-card flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Location</span>
                  <span className="text-[var(--text-secondary)]">{t.contact.location}</span>
                </div>
              </div>

              <div className="interactive-card flex items-center gap-3 p-3.5 sm:p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xs">
                <Clock className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <span className="text-[var(--text-tertiary)] block text-[11px]">Typical Response Time</span>
                  <span className="text-[var(--text-secondary)]">Within 24 business hours</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Clean Contact Form */}
          <ScrollReveal direction="right" delay={200} className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 sm:p-8 shadow-sm">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  Message Dispatched Successfully
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  {t.contact.successMessage}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-muted)] text-[var(--text-primary)] border border-[var(--border-prominent)] text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {error && (
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-mono text-[var(--text-secondary)]">
                      {t.contact.name} <span className="text-[var(--accent-primary)]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Abebe / Recruiter"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-tertiary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-mono text-[var(--text-secondary)]">
                      {t.contact.email} <span className="text-[var(--accent-primary)]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. contact@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-tertiary)]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="block text-xs font-mono text-[var(--text-secondary)]">
                    {t.contact.subject} <span className="text-[var(--accent-primary)]">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / AI Research / Career"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--accent-primary)] transition-colors placeholder:text-[var(--text-tertiary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-xs font-mono text-[var(--text-secondary)]">
                    {t.contact.message} <span className="text-[var(--accent-primary)]">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your objectives, timelines, or questions..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-hidden focus:border-[var(--accent-primary)] transition-colors resize-none placeholder:text-[var(--text-tertiary)] leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs sm:text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-sm active:scale-95 cursor-pointer font-mono"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.contact.sending}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.contact.send}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
