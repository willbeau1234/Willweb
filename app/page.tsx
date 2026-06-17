import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProjectsSection } from "@/components/projects-section"
import { ResearchSection } from "@/components/research-section"
import { BlogSection } from "@/components/blog-section"
import { ResumeSection } from "@/components/resume-section"
import { AISolutionsSection } from "@/components/ai-solutions-section"
import { ContactSection } from "@/components/contact-section"
import { SpaceBackground } from "@/components/space-background"
import { FeedDistortionPost } from "@/components/feed-distortion-post"

export default function Home() {
  return (
    <div className="min-h-screen">
      <SpaceBackground />
      <Navigation />
      <main>
        <HeroSection />
        <FeedDistortionPost />
        <ResumeSection />
        <ProjectsSection />
        <ResearchSection />
        <BlogSection />
        <AISolutionsSection />
        <ContactSection />
      </main>
    </div>
  )
}
