"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground() {
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!starsRef.current) return

    // Generate random stars
    const starCount = 200
    const stars = []

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "star"

      // Random size
      const size = Math.random()
      if (size < 0.7) {
        star.classList.add("star-small")
      } else if (size < 0.9) {
        star.classList.add("star-medium")
      } else {
        star.classList.add("star-large")
      }

      // Random position
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`

      // Random animation delay
      star.style.animationDelay = `${Math.random() * 3}s`

      stars.push(star)
    }

    stars.forEach((star) => starsRef.current?.appendChild(star))

    return () => {
      stars.forEach((star) => star.remove())
    }
  }, [])

  return (
    <div className="space-background">
      <div ref={starsRef} className="stars" />
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      <div className="nebula nebula-3" />
    </div>
  )
}
