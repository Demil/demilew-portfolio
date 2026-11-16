'use client';

import ScrollReveal from '@/components/ScrollReveal';
import {
  Brain,
  Server,
  Network,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
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
      'Custom neural architecture design & benchmark testing',
      'Anomaly detection & zero-day pattern analysis engines',
      'Differential privacy & federated learning protocols',
    ],
    deliverablesAm: [
      'የብጁ ኒውራል ኔትወርክ አርክቴክቸር ዝግጅት እና ሙከራ',
      'የኔትወርክ ጥቃት እና ያልተለመዱ ሁኔታዎች መለያ ሞተሮች',
      'ግላዊነትን የሚጠብቁ (Differential Privacy) እና ፌዴሬትድ ስልጠናዎች',
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
      'Docker containerization & automated Pytest suites',
    ],
    deliverablesAm: [
      'በደረጃው የተዘጋጀ RESTful API ከሙሉ የሰነድ ድጋፍ ጋር',
      'የ PostgreSQL ዳታቤዝ አደረጃጀት እና ፈጣን የጥያቄ ምላሽ',
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
      'Operational progress dashboards & stakeholder reporting',
    ],
    deliverablesAm: [
      'የተቀናጀ ዋና የጊዜ ሰሌዳ (IMS) እና ወሳኝ የሂደት ትንተና',
      'የንዑስ ተቋራጮች ስራ አፈጻጸም እና የስምምነት ክትትል',
      'ለከፍተኛ አመራር የሚቀርቡ የመረጃ ዳሽቦርዶች',
    ],
    engagementEn: ['Project Planning', 'Milestone Review', 'Delivery Governance'],
    engagementAm: ['የፕሮጀክት ቁጥጥር ማማከር', 'የሂደት ኦዲት', 'የአፈጻጸም አስተዳደር'],
  },
  {
    id: 'ai-security',
    number: '04',
    icon: ShieldCheck,
    titleEn: 'AI Security & Adversarial Defense',
    titleAm: 'የኤአይ ደህንነት እና ጥቃት መከላከያ',
    taglineEn: 'Deepfake detection, model robustness & data protection',
    taglineAm: 'የዲፕፌክ ምርመራ፣ የሞዴል ጥንካሬ ማረጋገጫ እና የመረጃ ደህንነት ኦዲት',
    descriptionEn:
      'Rigorous evaluation and hardening of machine learning systems against adversarial attacks, biometric spoofing, and unauthorized data leakage.',
    descriptionAm:
      'የማሽን ለርኒንግ ሲስተሞችን ከጥቃት መጠበቅ፣ የዲፕፌክ እና የባዮሜትሪክ ማታለሎችን መለየት እንዲሁም የመረጃ ደህንነትን ማረጋገጥ።',
    deliverablesEn: [
      'Adversarial vulnerability assessment & penetration testing',
      'Deepfake & synthetic media detection pipelines',
      'Model privacy auditing & data leakage mitigation',
    ],
    deliverablesAm: [
      'የማሽን ለርኒንግ ሞዴሎች የደህንነት ክፍተት ፍተሻ',
      'የዲፕፌክ እና የተፈበረኩ ምስሎች መለያ ቧንቧዎች',
      'የሞዴል ግላዊነት ኦዲት እና የመረጃ ፍሳሽ መከላከያ',
    ],
    engagementEn: ['Security Auditing', 'Model Hardening', 'Research Collaboration'],
    engagementAm: ['የደህንነት ኦዲት', 'የሞዴል ጥንካሬ ማጠናከር', 'የምርምር ትብብር'],
  },
];

export default function ServicesSection() {
  const { t, language } = useLanguage();

  return (
    <section id="services" className="py-16 sm:py-24 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-[var(--border-subtle)] gap-4 sm:gap-6">
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
        </ScrollReveal>

        {/* Clean 2x2 Services Grid without clutter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {SERVICES_DATA.map((service, idx) => {
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
                  <div className="space-y-4 sm:space-y-5">
                    {/* Top Bar: Service ID & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono tracking-wider text-[var(--text-tertiary)] uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
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
                      <div className="flex flex-wrap gap-1.5">
                        {engagements.map((eng, eIdx) => (
                          <span
                            key={eIdx}
                            className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] text-[11px] font-mono border border-[var(--border-subtle)]"
                          >
                            {eng}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Unified, Single Call-to-Action for Services */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
              {language === 'am'
                ? 'ለድርጅትዎ ወይም ለምርምር ቡድንዎ ተስማሚ መፍትሄ ይፈልጋሉ?'
                : 'Need custom systems engineering, AI research, or project control?'}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {language === 'am'
                ? 'በቀጥታ መልእክት በመላክ ስለ ስራዎ ወሰን እና የጊዜ ሰሌዳ እንወያይ።'
                : 'Initiate a direct inquiry to discuss scope, deliverables, and timelines.'}
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent-primary)] text-[#090b10] text-xs font-semibold hover:opacity-95 transition-all shadow-sm shrink-0 interactive-btn"
          >
            <span>{t.nav.letsTalk}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
