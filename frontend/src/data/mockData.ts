import {
  Education,
  Experience,
  Profile,
  Project,
  Research,
  Skill,
} from '@/types/portfolio';

export const INITIAL_PROFILE: Profile = {
  id: 1,
  full_name: 'Demilew Terefe',
  headline: 'AI & Backend Software Engineer | Applied Machine Learning & Systems',
  biography:
    'Software Engineer and Applied AI Researcher with a strong focus on distributed backend architectures, machine learning security, and privacy-preserving AI. Graduated with a Bachelor of Science in Software Engineering from Bahir Dar University with high distinction (CGPA 3.84/4.00). Extensive industry experience in telecom infrastructure project control at Huawei Technologies and data science engineering at the Information Network Security Administration (INSA).',
  location: 'Addis Ababa, Ethiopia',
  email: 'contact@demilewterefe.com',
  social_links: [
    { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com', display_order: 1, is_visible: true },
    { id: 2, platform: 'GitHub', url: 'https://github.com', display_order: 2, is_visible: true },
    { id: 3, platform: 'Email', url: 'mailto:contact@demilewterefe.com', display_order: 3, is_visible: true },
  ],
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'CNN–LSTM Based Anomaly Detection for Zero-Day and Low-Frequency Network Intrusions',
    slug: 'cnn-lstm-network-intrusion-detection',
    description:
      'Deep learning framework utilizing hybrid CNN-LSTM network architectures for real-time anomaly detection in network traffic, specifically targeting zero-day and low-frequency intrusions.',
    problem_statement:
      'Modern enterprise and telecom network perimeters face sophisticated polymorphic attacks and low-frequency intrusion patterns that evade conventional signature-based detection systems.',
    technical_approach:
      'Combines 1D Convolutional Neural Networks for spatial feature extraction with Long Short-Term Memory (LSTM) layers to capture temporal traffic dependencies across packet telemetry.',
    tech_stack: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Pandas', 'Scikit-Learn'],
    github_url: null,
    live_url: null,
    featured: true,
    display_order: 1,
    status: 'published',
  },
  {
    id: 2,
    title: 'AI-Enhanced Social Engineering and Deepfake Detection: A Privacy-Preserving Framework',
    slug: 'privacy-preserving-deepfake-detection',
    description:
      'Privacy-preserving multimodal framework designed to detect AI-generated media manipulations and social engineering attacks using Federated Learning and Differential Privacy.',
    problem_statement:
      'The rise of generative synthetic media enables targeted social engineering while data privacy regulations prevent centralizing sensitive biometric audio/visual data.',
    technical_approach:
      'Leverages decentralized Federated Learning combined with Differential Privacy noise perturbation to train multimodal detection networks across distributed nodes without exposing raw media.',
    tech_stack: ['Python', 'PyTorch', 'Federated Learning', 'Differential Privacy', 'OpenCV', 'FastAPI'],
    github_url: null,
    live_url: null,
    featured: true,
    display_order: 2,
    status: 'published',
  },
  {
    id: 3,
    title: 'Dashen Smart AI — Intelligent Document Retrieval and Question Answering',
    slug: 'dashen-smart-ai',
    description:
      'Authorized-document Retrieval-Augmented Generation (RAG) application providing accurate question answering over private institutional documents with native support for Amharic and English.',
    problem_statement:
      'Financial and corporate institutions struggle to quickly retrieve precise answers from extensive private document repositories in localized languages.',
    technical_approach:
      'Combines dense vector embeddings, cross-lingual semantic re-ranking, domain-specific tokenization for Ethiopic script, and strict role-based document access controls.',
    tech_stack: ['Python', 'FastAPI', 'Vector DB', 'RAG', 'LangChain', 'PostgreSQL', 'Next.js'],
    github_url: null,
    live_url: null,
    featured: true,
    display_order: 3,
    status: 'published',
  },
];

export const INITIAL_SKILLS: Skill[] = [
  // Backend & Distributed Systems
  { id: 1, name: 'Python (Advanced)', category: 'Backend', display_order: 1 },
  { id: 2, name: 'FastAPI', category: 'Backend', display_order: 2 },
  { id: 3, name: 'Flask & Django', category: 'Backend', display_order: 3 },
  { id: 4, name: 'SQLAlchemy 2.0', category: 'Backend', display_order: 4 },
  { id: 5, name: 'PostgreSQL', category: 'Backend', display_order: 5 },
  { id: 6, name: 'RESTful API Design', category: 'Backend', display_order: 6 },
  { id: 7, name: 'Microservices Architecture', category: 'Backend', display_order: 7 },
  // AI & Machine Learning
  { id: 8, name: 'PyTorch & TensorFlow', category: 'Other', display_order: 8 },
  { id: 9, name: 'Deep Learning & CNN-LSTM', category: 'Other', display_order: 9 },
  { id: 10, name: 'Natural Language Processing (NLP)', category: 'Other', display_order: 10 },
  { id: 11, name: 'Retrieval-Augmented Generation (RAG)', category: 'Other', display_order: 11 },
  { id: 12, name: 'Federated Learning & Privacy AI', category: 'Other', display_order: 12 },
  { id: 13, name: 'Network Intrusion Detection', category: 'Other', display_order: 13 },
  // DevOps & Cloud
  { id: 14, name: 'Docker & Docker Compose', category: 'DevOps', display_order: 14 },
  { id: 15, name: 'Linux & Bash Scripting', category: 'DevOps', display_order: 15 },
  { id: 16, name: 'Git & Monorepo Workflows', category: 'DevOps', display_order: 16 },
  { id: 17, name: 'CI/CD Automation', category: 'DevOps', display_order: 17 },
  // Frontend
  { id: 18, name: 'TypeScript', category: 'Frontend', display_order: 18 },
  { id: 19, name: 'React', category: 'Frontend', display_order: 19 },
  { id: 20, name: 'Next.js (App Router)', category: 'Frontend', display_order: 20 },
  { id: 21, name: 'Tailwind CSS', category: 'Frontend', display_order: 21 },
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: 'Huawei Technologies Ethiopia PLC',
    role: 'Project Control Manager (PCM)',
    description:
      'Overseeing telecom infrastructure project coordination, project planning, and execution control. Responsible for resource planning, project risk mitigation, progress monitoring, and managing telecom power infrastructure projects across regional deployments.',
    start_date: '2022-09-01',
    end_date: null,
    is_current: true,
    display_order: 1,
  },
  {
    id: 2,
    company: 'Information Network Security Administration (INSA)',
    role: 'Data Science Engineer',
    description:
      'Developed machine learning and deep learning pipelines, natural language processing models, and high-performance backend microservices using FastAPI, Flask, and Django. Implemented data processing workflows and applied AI solutions for security applications.',
    start_date: '2022-01-01',
    end_date: '2022-08-31',
    is_current: false,
    display_order: 2,
  },
];

export const INITIAL_EDUCATION: Education[] = [
  {
    id: 1,
    institution: 'Bahir Dar University',
    degree: 'Bachelor of Science',
    field: 'Software Engineering',
    start_date: '2017-10-01',
    end_date: '2022-07-01',
    cgpa: '3.84 / 4.00',
    display_order: 1,
  },
];

export const INITIAL_RESEARCH: Research[] = [
  {
    id: 1,
    title: 'Zero-Day Anomaly Detection in High-Throughput Network Perimeters',
    slug: 'zero-day-network-anomaly-detection',
    description:
      'Deep representation learning and temporal sequence models to identify subtle zero-day deviations in network packet telemetry without prior attack signatures.',
    methodology: 'Hybrid convolutional recurrent networks evaluated on modern network intrusion benchmarks.',
    display_order: 1,
    status: 'published',
  },
  {
    id: 2,
    title: 'Privacy-Preserving Federated Learning Architectures for Sensitive Multimodal Data',
    slug: 'federated-learning-privacy-preserving-ai',
    description:
      'Decentralized model training using Differential Privacy noise perturbation to prevent biometric leakage in deepfake detection.',
    methodology: 'Client-side differential privacy with noise calibration and communication-efficient aggregation.',
    display_order: 2,
    status: 'published',
  },
  {
    id: 3,
    title: 'Cross-Lingual Retrieval-Augmented Generation for Low-Resource Ethiopic Languages',
    slug: 'cross-lingual-rag-ethiopic',
    description:
      'Tokenization, semantic alignment, and dense retrieval techniques for low-resource languages including Amharic, enabling accurate contextual question answering.',
    methodology: 'Subword vocabulary adaptation, contrastive embeddings, and multilingual bi-encoders.',
    display_order: 3,
    status: 'published',
  },
];
