export type Language = 'en' | 'am';

export interface Translations {
  nav: {
    about: string;
    services: string;
    projects: string;
    research: string;
    skills: string;
    experience: string;
    contact: string;
    letsTalk: string;
    adminPortal: string;
    cv: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    highDistinction: string;
    narrative: string;
    downloadCv: string;
    viewCv: string;
    cvNotUploaded: string;
    cvCallout: string;
    exploreWork: string;
    verifiedDossier: string;
    academicHonors: string;
    industryExperience: string;
  };
  services: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    inquireButton: string;
    deliverablesLabel: string;
    engagementLabel: string;
  };
  projects: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    viewCaseStudy: string;
    sourceCode: string;
    liveDemo: string;
    problem: string;
    approach: string;
    stack: string;
  };
  skills: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    skillsCount: string;
  };
  research: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    methodology: string;
    viewPaper: string;
  };
  experience: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    education: string;
    workHistory: string;
    present: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    successMessage: string;
    directChannels: string;
    location: string;
  };
  footer: {
    rights: string;
    builtWith: string;
  };
  cvNotification: {
    badge: string;
    title: string;
    description: string;
    viewPdf: string;
    download: string;
    dismiss: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      research: 'Research',
      skills: 'Skills',
      experience: 'Experience',
      contact: 'Contact',
      letsTalk: "Let's Talk",
      adminPortal: 'Admin Portal',
      cv: 'CV',
    },
    hero: {
      eyebrow: 'Software Engineer & AI Researcher',
      headline: 'Demilew Terefe',
      highDistinction: 'BDU High Distinction (CGPA 3.84/4.00)',
      narrative:
        'Software Engineer graduated with High Distinction from Bahir Dar University. Engineering robust AI architectures, intelligent anomaly detection systems, and enterprise telecommunications solutions.',
      downloadCv: 'Download CV',
      viewCv: 'View CV',
      cvNotUploaded: 'CV not yet available',
      cvCallout: 'Evaluating for engineering or research roles? Review my verified Curriculum Vitae',
      exploreWork: 'Selected Works',
      verifiedDossier: 'Academic & Industry Credentials',
      academicHonors: 'B.Sc. in Software Engineering — CGPA 3.84/4.00',
      industryExperience: 'Huawei Telecom PCM & INSA Data Science',
    },
    services: {
      eyebrow: 'Professional Capabilities & Advisory',
      heading: 'Engineering Services & Technical Consulting',
      subtitle:
        'High-impact engineering, applied machine learning, and enterprise telecom project governance tailored for institutions, technology teams, and research labs.',
      inquireButton: 'Inquire for Engagement',
      deliverablesLabel: 'Key Deliverables & Methodologies',
      engagementLabel: 'Engagement Models',
    },
    projects: {
      eyebrow: 'Applied Engineering Case Studies',
      heading: 'Selected Projects & Implementations',
      subtitle:
        'Production systems engineered for network security, privacy-preserving deep learning, and enterprise telecom workflows.',
      viewCaseStudy: 'View Case Study',
      sourceCode: 'Source Code',
      liveDemo: 'Live Demo',
      problem: 'Problem Statement',
      approach: 'Technical Approach',
      stack: 'Technologies',
    },
    skills: {
      eyebrow: 'Technical Competencies',
      heading: 'Engineering Disciplines & Capability Directory',
      subtitle:
        'Organized by structural domain. Core competencies refined through enterprise telecom project management and applied data science engineering.',
      skillsCount: 'skills',
    },
    research: {
      eyebrow: 'Academic & Applied Inquiry',
      heading: 'Research Initiatives & Working Papers',
      subtitle:
        'Peer-reviewed and applied research focused on deep learning intrusion detection, multimodal deepfake privacy, and Ethiopic low-resource language modeling.',
      methodology: 'Methodology & Framework',
      viewPaper: 'Read Publication',
    },
    experience: {
      eyebrow: 'Chronological Dossier',
      heading: 'Professional Trajectory & Academic Foundation',
      subtitle:
        'Timeline of verified industry positions, university graduation honors, and national innovation projects.',
      education: 'Academic Degrees',
      workHistory: 'Professional Positions',
      present: 'Present',
    },
    contact: {
      eyebrow: 'Consultation & Inquiry Desk',
      heading: 'Initiate a Technical Dialogue',
      subtitle:
        'Available for AI engineering engagements, distributed systems architecture consultations, and collaborative research initiatives.',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Inquiry Subject',
      message: 'Detailed Message',
      send: 'Transmit Message',
      sending: 'Transmitting...',
      successMessage: 'Message transmitted successfully. Demilew will respond promptly.',
      directChannels: 'Direct Communication Channels',
      location: 'Addis Ababa / Bahir Dar, Ethiopia',
    },
    footer: {
      rights: 'All rights reserved.',
      builtWith: 'Engineered with Next.js, FastAPI & PostgreSQL.',
    },
    cvNotification: {
      badge: 'Recruiter & Hiring Notice',
      title: 'Curriculum Vitae Ready for Review',
      description: 'Access Demilew Terefe’s verified credentials, technical proficiencies, and publications.',
      viewPdf: 'View PDF',
      download: 'Download CV',
      dismiss: 'Dismiss',
    },
  },
  am: {
    nav: {
      about: 'ስለ እኔ',
      services: 'አገልግሎቶች',
      projects: 'ፕሮጀክቶች',
      research: 'ጥናቶች',
      skills: 'ክህሎቶች',
      experience: 'የሥራ ልምድ',
      contact: 'አግኙኝ',
      letsTalk: 'እንወያይ',
      adminPortal: 'አስተዳዳሪ ፖርታል',
      cv: 'CV',
    },
    hero: {
      eyebrow: 'የሶፍትዌር መሃንዲስ እና የኤአይ ተመራማሪ',
      headline: 'ደሚለው ተረፈ',
      highDistinction: 'ከባህር ዳር ዩኒቨርሲቲ በከፍተኛ ማዕረግ (CGPA 3.84/4.00)',
      narrative:
        'ከባህር ዳር ዩኒቨርሲቲ በሶፍትዌር ምህንድስና በከፍተኛ ማዕረግ የተመረቀ። ጥንካሬ ያላቸው የኤአይ ሥርዓቶች፣ የአውታረ መረብ ጥበቃ ቴክኖሎጂዎች እና የቴሌኮም መፍትሄዎችን የሚያዘጋጅ።',
      downloadCv: 'CV ያውርዱ',
      viewCv: 'CV ይመልከቱ',
      cvNotUploaded: 'CV እስካሁን አልተጫነም',
      cvCallout: 'የምህንድስና ወይም የምርምር አቅሜን ለመገምገም ይፈልጋሉ? የተረጋገጠ CV ይመልከቱ',
      exploreWork: 'የተመረጡ ሥራዎች',
      verifiedDossier: 'ትምህርታዊ እና ሙያዊ ማስረጃዎች',
      academicHonors: 'የሶፍትዌር ምህንድስና ባችለር — CGPA 3.84/4.00',
      industryExperience: 'የሁዋዌ ቴሌኮም PCM እና የኢንሳ (INSA) ዳታ ሳይንስ',
    },
    services: {
      eyebrow: 'ሙያዊ አገልግሎቶች እና የምክር አገልግሎት',
      heading: 'የምህንድስና አገልግሎቶች እና ቴክኒካዊ ማማከር',
      subtitle:
        'ለተቋማት፣ ለቴክኖሎጂ ድርጅቶች እና ለምርምር ማዕከላት የተዘጋጁ ከፍተኛ ጥራት ያላቸው የኤአይ ምህንድስና፣ የስርዓት ግንባታ እና የቴሌኮም ፕሮጀክት አስተዳደር አገልግሎቶች።',
      inquireButton: 'ለአገልግሎቱ ያነጋግሩኝ',
      deliverablesLabel: 'ዋና ዋና ውጤቶች እና የአሰራር ዘዴዎች',
      engagementLabel: 'የስራ ቅንጅት ሞዴሎች',
    },
    projects: {
      eyebrow: 'የምህንድስና ፕሮጀክቶች',
      heading: 'የተመረጡ ፕሮጀክቶች እና አተገባበሮች',
      subtitle:
        'ለኔትወርክ ደህንነት፣ ግላዊነት ለሚጠብቅ ጥልቅ ትምህርት እና ለቴሌኮም አገልግሎት የተዘጋጁ ዘመናዊ ሥርዓቶች።',
      viewCaseStudy: 'ዝርዝር ጥናት ይመልከቱ',
      sourceCode: 'የኮድ ምንጭ',
      liveDemo: 'ቀጥታ ማሳያ',
      problem: 'የችግሩ መነሻ',
      approach: 'የተከተልነው ቴክኒካዊ አካሄድ',
      stack: 'ያገለገሉ ቴክኖሎጂዎች',
    },
    skills: {
      eyebrow: 'ቴክኒካዊ ብቃቶች',
      heading: 'የምህንድስና መስኮች እና የክህሎት ማውጫ',
      subtitle:
        'በዘርፍ የተደራጁ። በቴሌኮም ፕሮጀክት አስተዳደር እና በተግባራዊ ዳታ ሳይንስ ምህንድስና የዳበሩ ዋና ዋና ክህሎቶች።',
      skillsCount: 'ክህሎቶች',
    },
    research: {
      eyebrow: 'አካዳሚክ እና ተግባራዊ ምርምር',
      heading: 'የምርምር ሥራዎች እና ጥናታዊ ጽሑፎች',
      subtitle:
        'በጥልቅ ትምህርት የኔትወርክ ጥቃት መለያ፣ ዲፕፌክ መመርመሪያ እና የኢትዮጵያ ቋንቋዎች ሞዴሊንግ ላይ ያተኮሩ ጥናቶች።',
      methodology: 'የጥናቱ ስነ-ዘዴ እና ማዕቀፍ',
      viewPaper: 'ጥናቱን ያንብቡ',
    },
    experience: {
      eyebrow: 'የጊዜ ቅደም ተከተል መዝገብ',
      heading: 'የሙያ ጉዞ እና አካዳሚክ መሠረት',
      subtitle:
        'የተረጋገጡ የኢንዱስትሪ የሥራ መደቦች፣ የዩኒቨርሲቲ የምረቃ ክብር እና የብሔራዊ ፈጠራ ፕሮጀክቶች የጊዜ ሰሌዳ።',
      education: 'የትምህርት ደረጃዎች',
      workHistory: 'የሥራ መደቦች',
      present: 'እስካሁን',
    },
    contact: {
      eyebrow: 'የምክክር እና የጥያቄ ጠረጴዛ',
      heading: 'ቴክኒካዊ ውይይት ይጀምሩ',
      subtitle:
        'ለኤአይ ምህንድስና ስራዎች፣ ለተከፋፈሉ ሲስተሞች ዲዛይን እና ለጋራ የምርምር ስራዎች ዝግጁ ነኝ።',
      name: 'ስምዎ',
      email: 'የኢሜይል አድራሻዎ',
      subject: 'የመልእክቱ ርዕስ',
      message: 'የመልእክቱ ዝርዝር',
      send: 'መልእክት ላክ',
      sending: 'በመላክ ላይ...',
      successMessage: 'መልእክትዎ በተሳካ ሁኔታ ተልኳል። ደሚለው በፍጥነት ምላሽ ይሰጥዎታል።',
      directChannels: 'ቀጥተኛ የመገናኛ መንገዶች',
      location: 'አዲስ አበባ / ባህር ዳር፣ ኢትዮጵያ',
    },
    footer: {
      rights: 'መብቱ በህግ የተጠበቀ ነው።',
      builtWith: 'በ Next.js፣ FastAPI እና PostgreSQL የተገነባ።',
    },
    cvNotification: {
      badge: 'ለቀጣሪዎች እና አጋሮች',
      title: 'የሥራ ዝርዝር (CV) ዝግጁ ነው',
      description: 'የደሚለው ተረፈን የትምህርት፣ የምህንድስና እና የሥራ ልምድ ማስረጃዎች ይመልከቱ።',
      viewPdf: 'CV ይመልከቱ',
      download: 'ያውርዱ',
      dismiss: 'ዝጋ',
    },
  },
};

