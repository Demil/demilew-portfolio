'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  Brain,
  Server,
  Network,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ServiceItem {
  id: string;
  number: string;
  icon: typeof Brain;
  titleEn: string;
  titleAm: string;
  taglineEn: string;
  taglineAm: string;
  descriptionEn: string;
  descriptionAm: string;
  deliverablesEn: string[];
  deliverablesAm: string[];
  engagementEn: string[];
  engagementAm: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'applied-ai',
    number: '01',
    icon: Brain,
    titleEn: 'Applied AI & Machine Learning',
    titleAm: 'ተግባራዊ የኤአይ እና ማሽን ለርኒንግ ሲስተሞች',
    taglineEn: 'Custom models, anomaly detection & privacy-preserving AI',
    taglineAm: 'የጥልቅ ትምህርት አርክቴክቸር፣ ጥቃትን የመለየት እና የግላዊነት ጥበቃ ስርዓቶች',
    descriptionEn:
      'Design and training of custom machine learning models, intelligent anomaly detection systems, and privacy-preserving data pipelines ready for production use.',
    descriptionAm:
      'የጥልቅ ትምህርት ሞዴሎችን ማሰልጠን፣ ግላዊነትን የሚጠብቁ የዳታ ቧንቧዎችን መዘርጋት እና ለተግባራዊ ስራ ዝግጁ ማድረግ።',
    deliverablesEn: [
      'Custom neural architecture design & testing',
      'Anomaly detection & pattern analysis engines',
      'Differential privacy & federated learning setups',
      'Model performance optimization & deployment',
    ],
    deliverablesAm: [
      'የብጁ ኒውራል ኔትወርክ አርክቴክቸር ዝግጅት እና ሙከራ',
      'የኔትወርክ ጥቃት እና ያልተለመዱ ሁኔታዎች መለያ ሞተሮች',
      'ግላዊነትን የሚጠብቁ (Differential Privacy) እና ፌዴሬትድ ስልጠናዎች',
      'የሞዴሎችን ፍጥነት ማሳደግ እና ማመቻቸት',
    ],
    engagementEn: ['R&D Prototyping', 'Custom AI Development', 'Technical Advisory'],
    engagementAm: ['የምርምር ፕሮቶታይፕ', 'ብጁ የኤአይ ምህንድስና', 'የቴክኒክ ማማከር'],
  },
  {
    id: 'backend-systems',
    number: '02',
    icon: Server,
    titleEn: 'Backend Systems & API Development',
    titleAm: 'አስተማማኝ የባክኤንድ እና የዳታቤዝ ሲስተሞች',
    taglineEn: 'Fast REST APIs, scalable databases & containerized services',
    taglineAm: 'ፈጣን የ REST API፣ ያልተመሳሰሉ የሰራተኛ ሂደቶች እና የማይክሮሰርቪስ አርክቴክቸር',
    descriptionEn:
      'Building scalable, maintainable backend services with Python, FastAPI, SQLAlchemy, PostgreSQL, and Docker. Focused on clean code, automated tests, and secure authentication.',
    descriptionAm:
      'በ Python፣ FastAPI፣ PostgreSQL እና Docker በመጠቀም ከፍተኛ ጭነት መቋቋም የሚችሉ አስተማማኝ ባክኤንድ ሲስተሞች፣ ጥብቅ የደህንነት ቁጥጥር እና የፍጥነት ማሻሻያዎችን መገንባት።',
    deliverablesEn: [
      'Clean RESTful APIs with OpenAPI documentation',
      'PostgreSQL schema optimization & fast query indexing',
      'Secure JWT authentication & role-based permissions',
      'Docker containerization & automated Pytest suites',
    ],
    deliverablesAm: [
      'በደረጃው የተዘጋጀ RESTful API ከሙሉ የሰነድ ድጋፍ ጋር',
      'የ PostgreSQL ዳታቤዝ አደረጃጀት እና ፈጣን የጥያቄ ምላሽ',
      'ደህንነቱ የተጠበቀ የ JWT ፈቃድ እና ሚና ላይ የተመሰረተ ቁጥጥር',
      'የዶከር ኮንቴይነራይዜሽን እና አውቶሜትድ የፍተሻ ስርዓቶች',
    ],
    engagementEn: ['Backend Development', 'API Architecture', 'System Modernization'],
    engagementAm: ['የባክኤንድ ግንባታ', 'የኤፒአይ አርክቴክቸር', 'የሲስተም ማሻሻያ'],
  },
  {
    id: 'telecom-pcm',
    number: '03',
    icon: Network,
    titleEn: 'Project Management & Planning',
    titleAm: 'የፕሮጀክት ቁጥጥር እና እቅድ አስተዳደር',
    taglineEn: 'Schedule tracking, milestone delivery & performance dashboards',
    taglineAm: 'የፕሮጀክት ዝርጋታ ክትትል፣ የወጪና ጊዜ ቁጥጥር እና የአደጋ ስጋት ትንበያ',
    descriptionEn:
      'Structured project control management rooted in enterprise Huawei telecom operations. Orchestrating schedules, tracking deliverables, and delivering clear status dashboards.',
    descriptionAm:
      'በሁዋዌ ቴሌኮም የስራ ልምድ ላይ የተመሰረተ ጥብቅ የፕሮጀክት ቁጥጥር፣ የጊዜ ሰሌዳ ክትትል፣ የስራ ተቋራጮች አፈጻጸም ግምገማ እና የመረጃ ትንተና ዳሽቦርድ ዝግጅት።',
    deliverablesEn: [
      'Integrated master project schedules & milestone tracking',
      'Vendor delivery coordination & SLA governance',
      'Project progress forecasting & risk mitigation',
      'Operational dashboards & stakeholder reporting',
    ],
    deliverablesAm: [
      'የተቀናጀ ዋና የጊዜ ሰሌዳ (IMS) እና ወሳኝ የሂደት ትንተና',
      'የንዑስ ተቋራጮች ስራ አፈጻጸም እና የስምምነት ክትትል',
      'የስራ እሴት (Earned Value) እና የስጋት ትንበያ ሪፖርቶች',
      'ለከፍተኛ አመራር የሚቀርቡ የመረጃ ዳሽቦርዶች',
    ],
    engagementEn: ['Project Planning', 'Milestone Review', 'Delivery Governance'],
    engagementAm: ['የፕሮጀክት ቁጥጥር ማማከር', 'የሂደት ኦዲት', 'የአፈጻጸም አስተዳደር'],
  },
  {
    id: 'ai-security',
    number: '04',
    icon: ShieldCheck,
    titleEn: 'AI Security & Privacy Reviews',
    titleAm: 'የኤአይ ደህንነት እና የግላዊነት ፍተሻ',
    taglineEn: 'Intrusion detection testing & model privacy assessments',
    taglineAm: 'የኔትወርክ ጥቃት መመርመሪያ እና የሀሰተኛ ምስል/ድምፅ (Deepfake) መከላከያ ፍተሻ',
    descriptionEn:
      'Evaluating vulnerabilities in machine learning systems and network architectures. Benchmarking models against attack patterns and testing privacy safeguards.',
    descriptionAm:
      'በማሽን ለርኒንግ ሲስተሞች እና በኔትወርክ መሠረተ ልማቶች ላይ የሚደርሱ የጥቃት አደጋዎችን መመርመር፣ የሳይበር ጥቃቶችን እና የዲፕፌክ ይዘቶችን የመለየት አቅምን መገምገም።',
    deliverablesEn: [
      'Network anomaly detection evaluations (NSL-KDD / CICIDS)',
      'Synthetic media & deepfake defense assessments',
      'Differential privacy leakage checks',
      'Clear vulnerability assessment & recommendation reports',
    ],
    deliverablesAm: [
      'የኔትወርክ ጥቃት መከላከያ ሞዴሎችን የመቋቋም አቅም መፈተሽ',
      'የዲፕፌክ እና አርቲፊሻል ይዘቶች መመርመሪያ ማረጋገጫ',
      'የመረጃ ፍሰት እና የግላዊነት ጥበቃ ኦዲት',
      'ዝርዝር የደህንነት ግምገማ እና የመፍትሄ ሃሳቦች ሪፖርት',
    ],
    engagementEn: ['Security Assessment', 'Vulnerability Auditing', 'Research Consultation'],
    engagementAm: ['የደህንነት ግምገማ', 'የስርዓት ኦዲት', 'የምርምር ማማከር'],
  },
];

export default function ServicesSection() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleInquire = (serviceTitle: string) => {
    // Dispatch custom event to prefill subject and scroll to contact form
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('set-contact-inquiry', {
          detail: {
            subject: `Inquiry: ${serviceTitle}`,
            messagePrefix: `I am reaching out regarding your "${serviceTitle}" capabilities.`,
          },
        })
      );
    }
  };

  const filteredServices =
    activeTab === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.id === activeTab);

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] transition-colors scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 sm:pb-12 sm:mb-12 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4" /> {t.services.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.services.heading}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Filter Pills with Mobile Horizontal Swipe */}
        <div className="flex items-center gap-2 mb-8 sm:mb-10 pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 min-h-[38px] transition-all active:scale-95 ${activeTab === 'all'
              ? 'bg-[var(--accent-primary)] text-white font-medium shadow-xs'
              : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
          >
            {language === 'am' ? 'ሁሉም አገልግሎቶች' : 'All Offerings (04)'}
          </button>
          {SERVICES_DATA.map((srv) => {
            const Icon = srv.icon;
            const isSelected = activeTab === srv.id;
            const label = language === 'am' ? srv.titleAm.split(' ')[0] : srv.titleEn.split(' ')[0] + ' ' + (srv.titleEn.split(' ')[1] || '');
            return (
              <button
                key={srv.id}
                onClick={() => setActiveTab(srv.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 min-h-[38px] transition-all active:scale-95 ${isSelected
                  ? 'bg-[var(--accent-primary)] text-white font-medium shadow-xs'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredServices.map((service, idx) => {
            const Icon = service.icon;
            const title = language === 'am' ? service.titleAm : service.titleEn;
            const tagline = language === 'am' ? service.taglineAm : service.taglineEn;
            const description = language === 'am' ? service.descriptionAm : service.descriptionEn;
            const deliverables = language === 'am' ? service.deliverablesAm : service.deliverablesEn;
            const engagements = language === 'am' ? service.engagementAm : service.engagementEn;

            return (
              <ScrollReveal key={service.id} delay={idx * 100} className="h-full">
                <article
                  className="group relative flex flex-col justify-between h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 rounded-xl p-5 sm:p-7 transition-all duration-300 interactive-card"
                >
                  <div className="space-y-5 sm:space-y-6">
                    {/* Top Bar: Service ID & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-wider text-[var(--text-tertiary)] uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                        SERVICE // {service.number}
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs font-mono text-[var(--accent-primary)] font-medium">
                        {tagline}
                      </p>
                    </div>

                    {/* Editorial Description */}
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      {description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                        {t.services.deliverablesLabel}
                      </span>
                      <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                        {deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Engagement Models */}
                    <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                        {t.services.engagementLabel}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {engagements.map((eng, eIdx) => (
                          <span
                            key={eIdx}
                            className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] text-[11px] font-mono border border-[var(--border-subtle)] interactive-pill"
                          >
                            {eng}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-5 mt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] text-center sm:text-left">
                      {language === 'am' ? 'የውይይት ጥያቄ ይላኩ' : 'Direct Advisory & Delivery'}
                    </span>
                    <button
                      onClick={() => handleInquire(title)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-mono px-4 py-2.5 min-h-[42px] rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] hover:text-[#090b10] border border-[var(--border-prominent)] hover:border-[var(--accent-primary)] transition-all shadow-xs interactive-btn group/btn font-semibold active:scale-95"
                    >
                      <span>{t.services.inquireButton}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Executive Collaboration Callout Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'am' ? 'ልዩ የትብብር እድሎች' : 'Tailored Engagements & Advisory'}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)]">
              {language === 'am'
                ? 'ለድርጅትዎ ወይም ለምርምር ቡድንዎ ተስማሚ መፍትሄ ይፈልጋሉ?'
                : 'Need custom systems engineering, research advisory, or telecom project control?'}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
              {language === 'am'
                ? 'የተሟላ የትምህርት እና የስራ ማስረጃዎች የያዘውን CV መመልከት ወይም በቀጥታ መልእክት በመላክ መወያየት ይችላሉ።'
                : 'Review my verified technical dossier, or initiate a direct inquiry to discuss scope, deliverables, and timelines.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#contact"
              onClick={() => handleInquire('General Technical Engagement')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-semibold hover:opacity-95 transition-opacity shadow-sm"
            >
              <span>{t.nav.letsTalk}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border-prominent)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-xs font-medium hover:bg-[var(--bg-muted)] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>{language === 'am' ? 'የተሟላ ማስረጃ ይመልከቱ' : 'Review Credentials'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

