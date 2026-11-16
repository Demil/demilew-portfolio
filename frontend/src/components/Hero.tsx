'use client';

import { CvInfo, Profile, PublicSettings } from '@/types/portfolio';
import { ArrowDown, Mail, Award, Briefcase, Cpu, ShieldCheck, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { useLanguage } from '@/context/LanguageContext';
import { DEFAULT_CV_INFO } from '@/lib/api';

interface HeroProps {
  profile?: Profile;
  settings?: PublicSettings;
  cvInfo?: CvInfo | null;
}

export default function Hero({ profile, settings, cvInfo }: HeroProps) {
  const { t, language } = useLanguage();
  const activeCv = cvInfo || DEFAULT_CV_INFO;

  const availability =
    settings?.availability_status || 'Available for projects • Call +251932045612 / +251953229831';

  const headline =
    profile?.headline ||
    (language === 'am'
      ? 'የኤአይ አልሚ እና ተመራማሪ | ማሽን ለርኒንግ እና ሲስተሞች'
      : 'AI Developer & Researcher | Machine Learning & Systems');

  return (
    <section id="about" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--border-subtle)] transition-colors ambient-glow-header overflow-hidden">
      {/* Decorative ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--accent-primary)]/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Authoritative Editorial Profile */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 animate-fade-in-up">
            {/* Availability Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono tracking-tight bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shadow-xs max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0 animate-pulse" />
              <span className="truncate">{availability}</span>
            </div>

            {/* Authoritative Primary Typography */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
                {language === 'am' ? 'ደምለው ተረፈ' : t.hero.headline}
              </h1>
              <p className="text-lg sm:text-2xl font-medium text-[var(--accent-primary)] tracking-tight">
                {headline}
              </p>
            </div>

            {/* Editorial Narrative: Three Strong Sentences - Career Path, Focus Area & Impact */}
            <div className="space-y-3 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              <p>
                {language === 'am'
                  ? 'የሙያ ጉዞዬ በመረጃ መረብ ደህንነት አስተዳደር (ኢንሳ / INSA) በሶፍትዌር ምህንድስና እና በሳይበር ደህንነት ምርምር ተጀምሮ፣ በሁዋዌ ቴክኖሎጂስ ኢትዮጵያ መጠነ-ሰፊ የቴሌኮም ስራዎችን በፕሮጀክት ቁጥጥር ስራ አስኪያጅነት (PCM) ወደመምራት አድጓል።'
                  : 'My career path evolved from software engineering and cybersecurity research at the Information Network Security Administration (INSA) to leading enterprise telecom deployments as Project Control Manager at Huawei Technologies Ethiopia.'}
              </p>
              <p>
                {language === 'am'
                  ? 'ዋና የቴክኒክ እና የምርምር ትኩረቴ በኤአይ ደህንነት (AI Security)፣ አዳዲስ የኔትወርክ ጥቃቶችን መለየት (Zero-Day Intrusion Detection)፣ ግላዊነትን በሚጠብቅ ዲፕ ለርኒንግ እና በጠንካራ የ FastAPI ባክኤንድ ሲስተሞች ላይ ያተኮረ ነው።'
                  : 'Today, my technical focus is centered on applied AI security, zero-day network intrusion detection architectures, privacy-preserving deep learning, and resilient FastAPI backend systems.'}
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-tertiary)]">
                {language === 'am'
                  ? 'ጥብቅ የፕሮጀክት አመራር ልምዴን ከተግባራዊ ማሽን ለርኒንግ ምህንድስና ጋር በማጣመር ተጨባጭ ችግሮችን የሚፈቱ አስተማማኝ፣ ፈጣን እና ደህንነታቸው የተጠበቀ ዘመናዊ ሲስተሞችን እገነባለሁ።'
                  : 'By pairing structured telecom delivery governance with advanced machine learning engineering, I build production-grade, reliable digital systems that solve critical real-world problems.'}
              </p>
            </div>

            {/* Action Triggers: 2 Clear, Uncluttered Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg bg-[var(--accent-primary)] text-[#090b10] font-semibold text-xs sm:text-sm interactive-btn shadow-md active:scale-95 text-center"
              >
                <span>{t.hero.exploreWork}</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
              </a>

              {activeCv ? (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cv-viewer'))}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-lg border border-[var(--accent-primary)] bg-[var(--bg-surface)] hover:bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-semibold text-xs sm:text-sm interactive-btn shadow-xs cursor-pointer active:scale-95 text-center"
                >
                  <FileText className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 shrink-0" />
                  <span>{t.hero.viewCv}</span>
                </button>
              ) : null}
            </div>

            {/* Connect & Direct Links */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs font-mono text-[var(--text-tertiary)]">
              <span className="text-[var(--text-tertiary)]">Profiles:</span>
              <a
                href="https://www.linkedin.com/in/demilew-terefe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <span className="text-[var(--border-prominent)] hidden sm:inline">/</span>
              <a
                href="https://github.com/Demil"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-[var(--border-prominent)] hidden sm:inline">/</span>
              <a
                href="mailto:demilew05terefe@gmail.com"
                className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px] sm:max-w-none">demilew05terefe@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: Structured Academic & Technical Dossier */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 sm:p-6 space-y-5 shadow-sm interactive-card animate-fade-in-up delay-200">
            {/* Dossier Header */}
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold block mb-1">
                {t.hero.verifiedDossier}
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {language === 'am' ? 'ደምለው ተረፈ' : t.hero.headline}
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
