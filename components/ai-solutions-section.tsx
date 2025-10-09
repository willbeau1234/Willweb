"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Shield, TrendingUp, MessageSquare, Database } from "lucide-react"

const services = [
  {
    icon: Brain,
    title: "Custom AI Development",
    description: "Tailored AI solutions designed specifically for your business needs and workflows.",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Intelligent chatbots and virtual assistants that understand and engage naturally.",
  },
  {
    icon: Database,
    title: "Data Intelligence",
    description: "Transform raw data into actionable insights with ML-powered analytics.",
  },
  {
    icon: Zap,
    title: "Process Automation",
    description: "Automate repetitive tasks and workflows with intelligent automation systems.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Forecast trends and make data-driven decisions with advanced ML models.",
  },
  {
    icon: Shield,
    title: "AI Integration",
    description: "Seamlessly integrate AI capabilities into your existing systems and platforms.",
  },
]

export function AISolutionsSection() {
  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="ai-solutions" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">AI Solutions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Empowering businesses with cutting-edge AI technology that drives growth, efficiency, and innovation
          </p>
          <Button size="lg" onClick={scrollToContact} className="rounded-full">
            Schedule a Consultation
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            )
          })}
        </div>

        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Business with AI?</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Let's discuss how AI can solve your specific challenges and unlock new opportunities for growth. I offer
              free consultations to explore the potential of AI for your business.
            </p>
            <Button size="lg" onClick={scrollToContact} variant="default" className="rounded-full">
              Get Started Today
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
