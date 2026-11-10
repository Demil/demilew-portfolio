'use client';

import { CvInfo, Profile, PublicSettings } from '@/types/portfolio';
import { ArrowDown, Mail, ArrowUpRight, Award, Briefcase, Cpu, ShieldCheck, FileText, Download } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface HeroProps {
  profile?: Profile;
  settings?: PublicSettings;
  cvInfo?: CvInfo | null;
}

export default function Hero({ profile, settings, cvInfo }: HeroProps) {
  const { t, language } = useLanguage();

  const availability =
    settings?.availability_status ||
    'Available for select software engineering opportunities & research collaborations';

  const headline =
    profile?.headline ||
    (language === 'am'
      ? 'የኤአይ እና ባክኤንድ ሶፍትዌር መሃንዲስ | ተግባራዊ ማሽን ለርኒንግ እና ሲስተሞች'
      : 'AI & Backend Software Engineer | Applied Machine Learning & Systems');

  const bio = profile?.biography || t.hero.narrative;

  return (
    <section id="about" className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Authoritative Editorial Profile */}
          <div className="lg:col-span-7 space-y-6">
            {/* Availability Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-xs font-mono tracking-tight bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">{availability}</span>
            </div>

            {/* Authoritative Primary Typography */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.08]">
                {t.hero.headline}
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-[var(--accent-primary)] tracking-tight">
                {headline}
              </p>
            </div>

            {/* Editorial Narrative */}
            <div className="space-y-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              <p>{bio}</p>
              <p className="text-sm sm:text-base text-[var(--text-tertiary)]">
                Specialized in architecting high-throughput REST APIs with Python and FastAPI, training hybrid deep learning architectures (CNN-LSTM) for zero-day network anomaly detection, and implementing privacy-preserving frameworks with Federated Learning and Differential Privacy.
              </p>
            </div>

            {/* Recruiter & Client CV Pointer Highlight */}
            {cvInfo && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span className="font-medium text-[var(--text-primary)]">{t.hero.cvCallout}</span>
                <span className="text-[var(--text-tertiary)] hidden sm:inline font-mono text-[11px]">
                  • {Math.round(cvInfo.file_size_bytes / 1024)} KB PDF
                </span>
              </div>
            )}

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--text-primary)] text-[var(--bg-base)] hover:opacity-90 font-medium text-xs sm:text-sm transition-all shadow-sm"
              >
                <span>{t.hero.exploreWork}</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#research"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-medium text-xs sm:text-sm transition-colors"
              >
                <span>{t.nav.research}</span>
                <ArrowUpRight className="w-4 h-4 text-[var(--text-tertiary)]" />
              </a>

              {cvInfo ? (
                <>
                  {/* View CV inline */}
                  <a
                    href={`${API_BASE_URL}/profile/cv/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--accent-primary)] bg-[var(--bg-surface)] hover:bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-medium text-xs sm:text-sm transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t.hero.viewCv}</span>
                  </a>
                  {/* Force Download CV */}
                  <a
                    href={`${API_BASE_URL}/profile/cv/download?download=1`}
                    download={cvInfo.filename}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-xs sm:text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.hero.downloadCv}</span>
                  </a>
                </>
              ) : null}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-medium text-xs sm:text-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span>{t.nav.contact}</span>
              </a>
            </div>

            {/* Institutional Profiles */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[var(--text-tertiary)]">
              <span className="text-[var(--text-tertiary)]">Profiles:</span>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <span className="text-[var(--border-prominent)] hidden sm:inline">/</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-[var(--border-prominent)] hidden sm:inline">/</span>
              <a
                href="mailto:contact@demilewterefe.com"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>contact@demilewterefe.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Structured Academic & Technical Dossier */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-6 shadow-sm">
            {/* Dossier Header */}
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold block mb-1">
                {t.hero.verifiedDossier}
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {t.hero.headline}
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                Addis Ababa, Ethiopia • Software Engineering &amp; Applied AI
              </p>
            </div>

            {/* Key Verified Competencies */}
            <div className="space-y-4 text-xs">
              {/* Academic Distinction */}
              <div className="space-y-1.5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <Award className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Academic Degree &amp; Honors</span>
                </div>
                <p className="text-[var(--text-primary)] pl-6 font-medium">
                  B.Sc. in Software Engineering — Bahir Dar University
                </p>
                <div className="pl-6 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-prominent)] font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                    CGPA 3.84 / 4.00 (High Distinction)
                  </span>
                </div>
              </div>

              {/* Industry Roles */}
              <div className="space-y-1.5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <Briefcase className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Professional Experience</span>
                </div>
                <div className="pl-6 space-y-2">
                  <div>
                    <span className="text-[var(--text-primary)] font-medium block">Project Control Manager (PCM)</span>
                    <span className="text-[var(--text-secondary)] text-[11px] block">Huawei Technologies Ethiopia PLC (2022 – Present)</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-primary)] font-medium block">Data Science Engineer</span>
                    <span className="text-[var(--text-secondary)] text-[11px] block">Information Network Security Administration (INSA)</span>
                  </div>
                </div>
              </div>

              {/* Technical Core */}
              <div className="space-y-1.5 pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <Cpu className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Primary Technical Stack</span>
                </div>
                <p className="text-[var(--text-secondary)] pl-6 leading-relaxed font-mono text-[11px]">
                  Python, FastAPI, PyTorch, TensorFlow, PostgreSQL, Docker, Next.js, TypeScript
                </p>
              </div>

              {/* Research Focus */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Primary Research Interests</span>
                </div>
                <p className="text-[var(--text-secondary)] pl-6 leading-relaxed">
                  AI Security, Zero-Day Intrusion Detection, Federated Learning, Differential Privacy &amp; Low-Resource Language RAG.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
