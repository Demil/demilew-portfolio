'use client';

import { useState } from 'react';
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
    titleEn: 'Applied AI & Machine Learning Systems',
    titleAm: 'ተግባራዊ የኤአይ እና ማሽን ለርኒንግ ሲስተሞች',
    taglineEn: 'Hybrid architectures, intrusion anomaly detection & privacy-preserving deep learning',
    taglineAm: 'የጥልቅ ትምህርት አርክቴክቸር፣ ጥቃትን የመለየት እና የግላዊነት ጥበቃ ስርዓቶች',
    descriptionEn:
      'End-to-end design and training of custom deep learning models (CNN-LSTM, Transformer baselines), privacy-preserving federated learning pipelines, and quantitative benchmarking for production deployment.',
    descriptionAm:
      'የጥልቅ ትምህርት ሞዴሎችን (CNN-LSTM፣ ትራንስፎርመር) ማሰልጠን፣ ግላዊነትን የሚጠብቁ ፌዴሬትድ ለርኒንግ ቧንቧዎችን መዘርጋት እና ለተግባራዊ ስራ ዝግጁ ማድረግ።',
    deliverablesEn: [
      'Custom neural architecture design & empirical evaluation',
      'Anomaly detection & multimodal pattern analysis engines',
      'Differential privacy (ε-budget) & Federated Learning setups',
      'Inference acceleration & model quantization pipelines',
    ],
    deliverablesAm: [
      'የብጁ ኒውራል ኔትወርክ አርክቴክቸር ዝግጅት እና ሙከራ',
      'የኔትወርክ ጥቃት እና ያልተለመዱ ሁኔታዎች መለያ ሞተሮች',
      'ግላዊነትን የሚጠብቁ (Differential Privacy) እና ፌዴሬትድ ስልጠናዎች',
      'የሞዴሎችን ፍጥነት ማሳደግ እና ማመቻቸት',
    ],
    engagementEn: ['R&D Prototyping', 'Custom AI Engineering', 'Technical Advisory'],
    engagementAm: ['የምርምር ፕሮቶታይፕ', 'ብጁ የኤአይ ምህንድስና', 'የቴክኒክ ማማከር'],
  },
  {
    id: 'backend-systems',
    number: '02',
    icon: Server,
    titleEn: 'High-Throughput Backend & Distributed Architecture',
    titleAm: 'ከፍተኛ አቅም ያላቸው የባክኤንድ እና የዳታቤዝ ሲስተሞች',
    taglineEn: 'Resilient REST APIs, asynchronous task workers & containerized microservices',
    taglineAm: 'ፈጣን የ REST API፣ ያልተመሳሰሉ የሰራተኛ ሂደቶች እና የማይክሮሰርቪስ አርክቴክቸር',
    descriptionEn:
      'Engineering high-concurrency microservices with Python, FastAPI, SQLAlchemy, PostgreSQL, and Redis. Emphasizing clean architectural separation, strict typing, automated test suites, and robust OAuth2/JWT RBAC.',
    descriptionAm:
      'በ Python፣ FastAPI፣ PostgreSQL እና Redis በመጠቀም ከፍተኛ ጭነት መቋቋም የሚችሉ አስተማማኝ ባክኤንድ ሲስተሞች፣ ጥብቅ የደህንነት ቁጥጥር እና የፍጥነት ማሻሻያዎችን መገንባት።',
    deliverablesEn: [
      'Domain-Driven RESTful APIs with OpenAPI & type contracts',
      'PostgreSQL schema optimization, indexing & async SQLAlchemy',
      'Stateless JWT authentication & granular role-based access (RBAC)',
      'Dockerized deployment, Pytest coverage & automated CI integration',
    ],
    deliverablesAm: [
      'በደረጃው የተዘጋጀ RESTful API ከሙሉ የሰነድ ድጋፍ ጋር',
      'የ PostgreSQL ዳታቤዝ አደረጃጀት እና ፈጣን የጥያቄ ምላሽ',
      'ደህንነቱ የተጠበቀ የ JWT ፈቃድ እና ሚና ላይ የተመሰረተ ቁጥጥር',
      'የዶከር ኮንቴይነራይዜሽን እና አውቶሜትድ የፍተሻ ስርዓቶች',
    ],
    engagementEn: ['Backend Development', 'API Architecture', 'Codebase Modernization'],
    engagementAm: ['የባክኤንድ ግንባታ', 'የኤፒአይ አርክቴክቸር', 'የሲስተም ማሻሻያ'],
  },
  {
    id: 'telecom-pcm',
    number: '03',
    icon: Network,
    titleEn: 'Telecom Infrastructure & Project Control Management (PCM)',
    titleAm: 'የቴሌኮም መሠረተ ልማት እና የፕሮጀክት ቁጥጥር አስተዳደር',
    taglineEn: 'Rollout milestone governance, critical path forecasting & delivery auditing',
    taglineAm: 'የቴሌኮም ዝርጋታ ክትትል፣ የወጪና ጊዜ ቁጥጥር እና የአደጋ ስጋት ትንበያ',
    descriptionEn:
      'Rigorous project control management rooted in enterprise Huawei telecom operations. Orchestrating multi-site turnkey rollouts, critical path scheduling, subcontractor SLA enforcement, and data-driven delivery dashboards.',
    descriptionAm:
      'በሁዋዌ ቴሌኮም የስራ ልምድ ላይ የተመሰረተ ጥብቅ የፕሮጀክት ቁጥጥር፣ የጊዜ ሰሌዳ ክትትል፣ የስራ ተቋራጮች አፈጻጸም ግምገማ እና የመረጃ ትንተና ዳሽቦርድ ዝግጅት።',
    deliverablesEn: [
      'Integrated Master Schedule (IMS) & critical path schedule analysis',
      'Subcontractor delivery tracking & SLA compliance governance',
      'Earned Value (EV) variance analysis & milestone risk forecasting',
      'Executive progress telemetry & operational dashboarding',
    ],
    deliverablesAm: [
      'የተቀናጀ ዋና የጊዜ ሰሌዳ (IMS) እና ወሳኝ የሂደት ትንተና',
      'የንዑስ ተቋራጮች ስራ አፈጻጸም እና የስምምነት ክትትል',
      'የስራ እሴት (Earned Value) እና የስጋት ትንበያ ሪፖርቶች',
      'ለከፍተኛ አመራር የሚቀርቡ የመረጃ ዳሽቦርዶች',
    ],
    engagementEn: ['Project Control Advisory', 'Milestone Auditing', 'Delivery Governance'],
    engagementAm: ['የፕሮጀክት ቁጥጥር ማማከር', 'የሂደት ኦዲት', 'የአፈጻጸም አስተዳደር'],
  },
  {
    id: 'ai-security',
    number: '04',
    icon: ShieldCheck,
    titleEn: 'AI Security & Algorithmic Defense Auditing',
    titleAm: 'የኤአይ ደህንነት እና የአልጎሪዝም ጥበቃ ኦዲት',
    taglineEn: 'Zero-day intrusion detection evaluation & multimodal deepfake defense verification',
    taglineAm: 'የኔትወርክ ጥቃት መመርመሪያ እና የሀሰተኛ ምስል/ድምፅ (Deepfake) መከላከያ ፍተሻ',
    descriptionEn:
      'Assessing vulnerability surfaces in machine learning systems and critical network infrastructure. Applying peer-reviewed detection methodologies to benchmark algorithmic resilience against novel intrusion vectors and synthetic media.',
    descriptionAm:
      'በማሽን ለርኒንግ ሲስተሞች እና በኔትወርክ መሠረተ ልማቶች ላይ የሚደርሱ የጥቃት አደጋዎችን መመርመር፣ የሳይበር ጥቃቶችን እና የዲፕፌክ ይዘቶችን የመለየት አቅምን መገምገም።',
    deliverablesEn: [
      'Network anomaly detection resilience benchmarks (NSL-KDD / CICIDS)',
      'Multimodal synthetic media / deepfake defense verification',
      'Privacy leakage audits under differential privacy guarantees',
      'Executive vulnerability remediation reports & threat models',
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
    <section id="services" className="py-24 border-b border-[var(--border-subtle)] transition-colors scroll-mt-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 border-b border-[var(--border-subtle)] gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4" /> {t.services.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              {t.services.heading}
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        {/* Filter Pills for quick visitor interaction */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'all'
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const title = language === 'am' ? service.titleAm : service.titleEn;
            const tagline = language === 'am' ? service.taglineAm : service.taglineEn;
            const description = language === 'am' ? service.descriptionAm : service.descriptionEn;
            const deliverables = language === 'am' ? service.deliverablesAm : service.deliverablesEn;
            const engagements = language === 'am' ? service.engagementAm : service.engagementEn;

            return (
              <article
                key={service.id}
                className="group relative flex flex-col justify-between bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40 rounded-xl p-7 transition-all duration-300 hover:shadow-md"
              >
                <div className="space-y-6">
                  {/* Top Bar: Service ID & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-wider text-[var(--text-tertiary)] uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                      SERVICE // {service.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--accent-primary)] font-medium">
                      {tagline}
                    </p>
                  </div>

                  {/* Editorial Description */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] block">
                      {t.services.deliverablesLabel}
                    </span>
                    <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                      {deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
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
                      {engagements.map((eng, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] text-[11px] font-mono border border-[var(--border-subtle)]"
                        >
                          {eng}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                    {language === 'am' ? 'የውይይት ጥያቄ ይላኩ' : 'Direct Advisory & Delivery'}
                  </span>
                  <button
                    onClick={() => handleInquire(title)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3.5 py-2 rounded-lg bg-[var(--bg-surface-elevated)] hover:bg-[var(--accent-primary)] text-[var(--text-primary)] hover:text-white border border-[var(--border-prominent)] hover:border-[var(--accent-primary)] transition-all shadow-xs group/btn"
                  >
                    <span>{t.services.inquireButton}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </article>
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

