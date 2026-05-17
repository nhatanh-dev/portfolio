import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechStackSection from "@/components/TechStackSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050c1a] text-slate-200 overflow-x-hidden w-full">
      <Navbar />
      <HeroSection />

      {/* Section dividers */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(56,189,248,0.15)] to-transparent" />
      </div>

      <TechStackSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(56,189,248,0.15)] to-transparent" />
      </div>

      <ExperienceSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(249,115,22,0.12)] to-transparent" />
      </div>

      <ProjectsSection />

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(56,189,248,0.15)] to-transparent" />
      </div>

      <EducationSection />

      <Footer />
    </main>
  );
}
