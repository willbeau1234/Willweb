"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Operation Lens AI",
    description:
      "Enterprise-grade reporting software used by Dairy Queen that provides real-time analytics on labor, inventory management, and predictive insights. Streamlines operations with AI-powered forecasting to optimize workforce and inventory decisions.",
    image: "/Operatorlens.png",
    tags: ["React", "Python", "AI/ML", "Real-time Analytics"],
    category: "Enterprise Solutions",
    link: "https://www.operationlensai.com/",
  },
  {
    id: 2,
    title: "The Democracy Daily",
    description:
      "An innovative platform that allows users to voice their opinions and engage in AI-powered debates. Express your viewpoint and watch as AI argues both sides of the debate, helping you explore different perspectives on important issues.",
    image: "/Democracydaily.png",
    tags: ["React", "Python", "Node.js", "Firebase"],
    category: "AI Solutions",
    link: "https://www.thedemocracydaily.com/",
  },
]

const categories = ["All", "Enterprise Solutions", "AI Solutions"]

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of AI-powered solutions I've built for clients across various industries
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <a href={project.link} className="flex items-center gap-2 text-sm font-medium text-foreground">
                    View Project <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
