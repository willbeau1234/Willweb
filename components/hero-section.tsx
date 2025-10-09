import { ChatInterface } from "@/components/chat-interface"

export function HeroSection() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-balance">AI Solutions Developer</h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto">
            Building intelligent systems that transform how businesses operate
          </p>
        </div>

        <ChatInterface />
      </div>
    </section>
  )
}
