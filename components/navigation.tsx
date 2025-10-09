"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function Navigation() {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            Will Beaumaster
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat with AI
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("blog")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </button>
            <button
              onClick={() => scrollToSection("resume")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Resume
            </button>
            <button
              onClick={() => scrollToSection("ai-solutions")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              AI Solutions
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </button>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} className="rounded-full">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
