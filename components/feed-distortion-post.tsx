"use client"

import { useState } from "react"

export function FeedDistortionPost() {
  const [showApp, setShowApp] = useState(false)

  // Replace this with your Railway/Render URL after deployment
  const appUrl = process.env.NEXT_PUBLIC_FEED_DISTORTION_URL || ""

  return (
    <section id="feed-distortion" className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <article>
          <header className="mb-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">June 2026</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Feed Distortion Index
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Record yourself scrolling Instagram for 30-60 seconds.
              This tool figures out which posts you actually stopped on and scores your feed.
            </p>
          </header>

          {appUrl ? (
            <div className="space-y-6">
              {!showApp ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowApp(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    Try It Yourself
                  </button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Upload a screen recording to analyze your scroll behavior
                  </p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-gray-700 bg-white">
                  <iframe
                    src={appUrl}
                    className="w-full"
                    style={{ height: "800px" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed border-gray-600">
              <p className="text-muted-foreground">
                App deployment in progress. Check back soon.
              </p>
            </div>
          )}

          <div className="mt-12 prose prose-invert max-w-none space-y-6 text-gray-300">
            <h3 className="text-xl font-semibold text-white">How it works</h3>

            <p>
              The tool uses phase correlation to detect when you pause while scrolling.
              Every time you stop for more than half a second, it captures that post
              and sends it to a vision model to categorize it.
            </p>

            <p>
              Posts get scored on five dimensions: appearance focus, how polished the content is,
              emotional intensity, negativity, and aspirational content (stuff you might envy).
              The final score shows how &quot;distorted&quot; your feed is toward engagement-bait.
            </p>

            <p className="text-sm text-gray-500">
              This is a toy for curiosity, not a research instrument. All the thresholds are rough guesses.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
