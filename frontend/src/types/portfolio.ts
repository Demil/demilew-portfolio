export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  display_order: number;
  is_visible: boolean;
}

export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  biography: string;
  location: string;
  email: string;
  cv_media_id?: number | null;
  profile_image_media_id?: number | null;
  profile_image_url?: string | null;
  social_links: SocialLink[];
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  problem_statement?: string | null;
  technical_approach?: string | null;
  tech_stack: string[];
  github_url?: string | null;
  live_url?: string | null;
  featured: boolean;
  display_order: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  display_order: number;
  icon_name?: string | null;
  status?: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  display_order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  cgpa?: string | null;
  display_order: number;
}

export interface Research {
  id: number;
  title: string;
  slug: string;
  description: string;
  methodology?: string | null;
  publication_url?: string | null;
  display_order: number;
  status?: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  credential_url?: string | null;
  display_order: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CvInfo {
  id: number;
  filename: string;
  file_size_bytes: number;
  mime_type: string;
  url: string;
  uploaded_at: string;
}

export interface PublicSettings {
  site_title?: string;
  site_tagline?: string;
  meta_description?: string;
  contact_email?: string;
  availability_status?: string;
  [key: string]: string | undefined;
}
