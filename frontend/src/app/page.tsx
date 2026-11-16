import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import ResearchSection from '@/components/ResearchSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import CvViewerModal from '@/components/CvViewerModal';
import {
  getCvInfo,
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getPublicSettings,
  getResearch,
  getSkills,
} from '@/lib/api';

export const revalidate = 60;

export default async function Home() {
  const [profile, projects, skills, experiences, education, research, settings, cvInfo] =
    await Promise.all([
      getProfile(),
      getProjects(),
      getSkills(),
      getExperience(),
      getEducation(),
      getResearch(),
      getPublicSettings(),
      getCvInfo(),
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] antialiased transition-colors">
      <Navbar />
      <main className="flex-1">
        <Hero profile={profile} settings={settings} cvInfo={cvInfo} />
        <ProjectsSection projects={projects} />
        <ResearchSection research={research} />
        <SkillsSection skills={skills} />
        <ExperienceSection experiences={experiences} education={education} />
        <ContactSection cvInfo={cvInfo} />
      </main>
      <Footer />
      <ScrollToTop />
      <CvViewerModal />
    </div>
  );
}
