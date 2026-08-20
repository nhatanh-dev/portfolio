import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechStackSection from "@/components/TechStackSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";
import Script from "next/script";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nguyen Pham Nhat Anh",
  url: "https://npna.dev",
  image: "https://npna.dev/avt.jpg",
  jobTitle: "Backend and Cloud Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "FPT University HCM",
  },
  sameAs: [
    "https://github.com/nhatanh-dev",
    "https://www.linkedin.com/in/anhnguyen2505/",
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main
        id="main-content"
        className="min-h-[100dvh] w-full overflow-x-clip bg-[var(--background)] text-[var(--foreground)]"
      >
        <HeroSection />

        <TechStackSection />
        <ExperienceSection />
        <ProjectsSection />
        <EducationSection />
      </main>
      <Footer />
    </>
  );
}
