"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BookOpen } from "lucide-react"

const research = [
  {
    id: 1,
    title: "AI Theory of Mind Testbed",
    description:
      "Ongoing collaborative research with Professor Paul Schrater developing a comprehensive testbed for evaluating AI Theory of Mind capabilities. Utilizing neural networks to solve complex cognitive reasoning tasks, this work aims to advance our understanding of how AI systems can model and predict human mental states and intentions.",
    image: "/Research.png",
    tags: ["Theory of Mind", "Neural Networks", "Cognitive AI", "Deep Learning"],
    category: "Cognitive AI",
    link: "#",
    status: "Ongoing Research",
  },
  {
    id: 2,
    title: "SHAP Values & Explainable AI Visualization",
    description:
      "Research work submitted to CHI Conference exploring interactive visualization techniques for SHAP (SHapley Additive exPlanations) values in machine learning models. This work advances explainable AI by making model predictions more interpretable and transparent through innovative visual analytics approaches.",
    image: "/SHAP.png",
    tags: ["Explainable AI", "SHAP Values", "Visualization", "HCI"],
    category: "Explainable AI",
    link: "https://shap-vis-tutorial-nu.vercel.app/All",
    status: "Submitted to CHI Conference",
  },
]

const categories = ["All", "Cognitive AI", "Explainable AI", "Human-Computer Interaction"]

export function ResearchSection() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredResearch =
    selectedCategory === "All" ? research : research.filter((r) => r.category === selectedCategory)

  return (
    <section id="research" className="py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-blue-400">Research & Interests</h2>
          </div>
          <p className="text-lg text-blue-400 max-w-2xl mx-auto">
            Exploring the frontiers of AI explainability and human-computer interaction
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

        {/* Research grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResearch.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    View Research <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>
                {item.status && (
                  <Badge variant="outline" className="mb-3 text-xs">
                    {item.status}
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
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
