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
      eyebrow: 'AI Developer & Researcher',
      headline: 'Demilew Terefe',
      highDistinction: 'Bahir Dar University (CGPA 3.84/4.00)',
      narrative:
        'My focus: AI security, zero-day intrusion detection, and privacy-preserving deep learning systems.',
      downloadCv: 'Download CV',
      viewCv: 'View CV',
      cvNotUploaded: 'CV not yet available',
      cvCallout: 'Looking to collaborate or hire? Check out my verified Curriculum Vitae',
      exploreWork: 'View Projects',
      verifiedDossier: 'Background & Credentials',
      academicHonors: 'B.Sc. in Software Engineering — CGPA 3.84/4.00',
      industryExperience: 'Huawei Technologies PCM & INSA Data Science',
    },
    services: {
      eyebrow: 'What I Do',
      heading: 'Services & Solutions',
      subtitle:
        'Practical AI development, backend systems, and technical consulting to help your team build and deliver reliable digital products.',
      inquireButton: 'Get in Touch',
      deliverablesLabel: 'What I Deliver',
      engagementLabel: 'Ways We Can Work Together',
    },
    projects: {
      eyebrow: 'Projects & Publications',
      heading: 'My Projects and Publications',
      subtitle:
        'Real-world systems built for cybersecurity, machine learning, and intelligent document search.',
      viewCaseStudy: 'View Project',
      sourceCode: 'Source Code',
      liveDemo: 'Live Demo',
      problem: 'The Challenge',
      approach: 'How It Was Built',
      stack: 'Technologies Used',
    },
    skills: {
      eyebrow: 'My Toolbox',
      heading: 'Skills & Technologies',
      subtitle:
        'A practical overview of the programming languages, frameworks, and developer tools I work with daily.',
      skillsCount: 'skills',
    },
    research: {
      eyebrow: 'Publications',
      heading: 'My Research Area',
      subtitle:
        'Research focused on intrusion detection, deepfake defense, and local language AI models.',
      methodology: 'Methodology & Datasets',
      viewPaper: 'Read Paper',
    },
    experience: {
      eyebrow: 'Career Journey',
      heading: 'Experience & Education',
      subtitle:
        'My professional path across software development, project management, and university honors.',
      education: 'Education',
      workHistory: 'Work Experience',
      present: 'Present',
    },
    contact: {
      eyebrow: 'Contact Me',
      heading: "Let's Connect",
      subtitle:
        'Whether you have an upcoming project, a research opportunity, or just want to discuss ideas, feel free to drop me a note.',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Your Message',
      send: 'Send Message',
      sending: 'Sending...',
      successMessage: 'Thank you! Your message was sent successምully. I will get back to you shortly.',
      directChannels: 'Direct Contact Details',
      location: 'Addis Ababa / Bahir Dar, Ethiopia',
    },
    footer: {
      rights: 'All rights reserved.',
      builtWith: 'Built with Next.js, FastAPI & PostgreSQL.',
    },
    cvNotification: {
      badge: 'Quick Access',
      title: 'Curriculum Vitae',
      description: 'View Demilew Terefe’s verified resume, project history, and academic honors.',
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
      eyebrow: 'የኤአይ አልሚ እና ተመራማሪ',
      headline: 'ደምለው ተረፈ',
      highDistinction: 'ከባህር ዳር ዩኒቨርሲቲ (CGPA 3.84/4.00)',
      narrative:
        'ትኩረቴ የኤአይ ደህንነት፣ አዳዲስ የጥቃት ምርመራ (Zero-Day Detection) እና ተጨባጭ ዲፕ ለርኒንግ ሲስተሞች ላይ ነው።',
      downloadCv: 'CV ያውርዱ',
      viewCv: 'CV ይመልከቱ',
      cvNotUploaded: 'CV እስካሁን አልተጫነም',
      cvCallout: 'አብረው ለመስራት ወይም ለመቅጠር ይፈልጋሉ? የተረጋገጠ CV ይመልከቱ',
      exploreWork: 'ፕሮጀክቶችን ይመልከቱ',
      verifiedDossier: 'ትምህርት እና የሥራ ልምድ',
      academicHonors: 'የሶፍትዌር ምህንድስና ባችለር — CGPA 3.84/4.00',
      industryExperience: 'የሁዋዌ ቴሌኮም PCM እና የኢንሳ (INSA) ዳታ ሳይንስ',
    },
    services: {
      eyebrow: 'የምሰጣቸው አገልግሎቶች',
      heading: 'አገልግሎቶች እና መፍትሄዎች',
      subtitle:
        'የኤአይ ግንባታ፣ የባክኤንድ ሲስተሞች እና አስተማማኝ የቴክኖሎጂ ምክር አገልግሎቶች።',
      inquireButton: 'ያነጋግሩኝ',
      deliverablesLabel: 'የሚያገኙት ውጤት',
      engagementLabel: 'የአሰራር መንገዶች',
    },
    projects: {
      eyebrow: 'ፕሮጀክቶች እና ህትመቶች',
      heading: 'የእኔ ፕሮጀክቶች እና ህትመቶች',
      subtitle:
        'ለሳይበር ደህንነት፣ ለማሽን ለርኒንግ እና ለመረጃ ፍለጋ የተሰሩ እውነተኛ ሲስተሞች።',
      viewCaseStudy: 'ዝርዝሩን ይመልከቱ',
      sourceCode: 'የኮድ ምንጭ',
      liveDemo: 'ቀጥታ ማሳያ',
      problem: 'ያጋጠመው ፈተና',
      approach: 'የተሰራበት መንገድ',
      stack: 'ያገለገሉ ቴክኖሎጂዎች',
    },
    skills: {
      eyebrow: 'የሙያ መሳሪያዎች',
      heading: 'ክህሎቶች እና ቴክኖሎጂዎች',
      subtitle:
        'በየቀኑ የምጠቀምባቸው የፕሮግራሚንግ ቋንቋዎች፣ ፍሬምዎርኮች እና የልማት መሳሪያዎች።',
      skillsCount: 'ክህሎቶች',
    },
    research: {
      eyebrow: 'ምርምር እና ጽሑፎች',
      heading: 'የእኔ የምርምር መስክ',
      subtitle:
        'በጥቃት መከላከል፣ በዲፕፌክ ምርመራ እና በሀገር ውስጥ ቋንቋዎች ኤአይ ላይ ያተኮሩ ጥናቶች።',
      methodology: 'የስራ ዘዴ እና ዳታሴቶች',
      viewPaper: 'ጥናቱን ያንብቡ',
    },
    experience: {
      eyebrow: 'የሙያ ጉዞ',
      heading: 'የሥራ ልምድ እና ትምህርት',
      subtitle:
        'የሶፍትዌር ልማት፣ የፕሮጀክት አስተዳደር እና የዩኒቨርሲቲ የምረቃ ጉዞዬ።',
      education: 'ትምህርት',
      workHistory: 'የሥራ ልምድ',
      present: 'እስካሁን',
    },
    contact: {
      eyebrow: 'ያግኙኝ',
      heading: 'እንገናኝ',
      subtitle:
        'አዲስ ፕሮጀክት፣ የምርምር እድል ወይም ሀሳብ ካለዎት በነፃነት መልእክት ይላኩልኝ።',
      name: 'ስምዎ',
      email: 'ኢሜይልዎ',
      subject: 'ርዕስ',
      message: 'መልእክትዎ',
      send: 'መልእክት ላክ',
      sending: 'በመላክ ላይ...',
      successMessage: 'እናመሰግናለን! መልእክትዎ ደርሶኛል። በፍጥነት እመልሳለሁ።',
      directChannels: 'የቀጥታ አድራሻዎች',
      location: 'አዲስ አበባ / ባህር ዳር፣ ኢትዮጵያ',
    },
    footer: {
      rights: 'መብቱ በህግ የተጠበቀ ነው።',
      builtWith: 'በ Next.js፣ FastAPI እና PostgreSQL የተገነባ።',
    },
    cvNotification: {
      badge: 'ፈጣን መረጃ',
      title: 'የሥራ ዝርዝር (CV)',
      description: 'የደምለው ተረፈን የትምህርት እና የሥራ ልምድ ማስረጃ ይመልከቱ።',
      viewPdf: 'CV ይመልከቱ',
      download: 'ያውርዱ',
      dismiss: 'ዝጋ',
    },
  },
};

