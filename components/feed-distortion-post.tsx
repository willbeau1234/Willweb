"use client"

import { useState } from "react"

export function FeedDistortionPost() {
  const appUrl = "https://feed-distortion-app-production.up.railway.app"
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("You're in. Check your email.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error || "Something went wrong")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="container mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
          <span className="text-lg font-medium text-stone-800">Feed Distortion Index</span>
          <div className="flex items-center gap-4">
            <a
              href="#subscribe"
              className="text-sm text-stone-600 hover:text-stone-800 transition-colors"
            >
              Subscribe
            </a>
            <a
              href="https://willbeaumaster.com"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              Will Beaumaster
            </a>
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="py-12 md:py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-medium text-stone-800 mb-6 leading-tight">
            What does your Instagram feed say about you?
          </h1>

          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              I built this because I wanted to know what I actually stop to look at when I scroll.
              Not what I think I look at, but what actually catches my attention. Turns out those
              are pretty different things.
            </p>
            <p>
              The idea is simple: record yourself scrolling for 30-60 seconds, upload it here,
              and the tool figures out which posts you paused on. Then it scores each one on
              things like how polished the content is, how emotionally intense, whether it's
              the kind of stuff that makes you feel like you're missing out on something.
            </p>
            <p className="text-sm bg-stone-100 p-4 rounded-lg">
              <strong className="text-stone-700">How to record:</strong> On iPhone, swipe down
              from the top-right corner and tap the screen record button (or add it in Settings → Control Center).
              On Android, swipe down twice and tap Screen Record. Open Instagram, scroll naturally
              for 30-60 seconds, stop recording, and upload the video here.
            </p>
            <p>
              I don't know if this means anything profound. But I do think there's something
              interesting about seeing your attention patterns laid out like that. It felt
              different than I expected.
            </p>
          </div>
        </div>
      </section>

      {/* App embed */}
      <section className="px-6 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-lg overflow-hidden border border-stone-200 shadow-sm">
            <iframe
              src={appUrl}
              className="w-full bg-white"
              style={{ height: "850px" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-stone-800">How it works</h2>
            <a
              href="/feed-distortion-methodology.html"
              target="_blank"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors underline"
            >
              Read the full methodology
            </a>
          </div>

          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-700">Finding the pauses.</strong> The tool watches your
              screen recording frame by frame. When the scroll stops for more than half a second,
              that's a pause—you stopped to look at something. It captures that post.
            </p>
            <p>
              <strong className="text-stone-700">Scoring the content.</strong> Each captured post
              gets scored on five things: appearance focus (beauty, fashion, body stuff), how
              polished it looks, emotional intensity, negativity, and aspirational content
              (luxury, travel, success—the stuff that can make you feel like you're behind).
            </p>
            <p>
              <strong className="text-stone-700">The final number.</strong> Your distortion score
              combines all of this using a version of the peak-end rule from psychology—the idea
              that we remember experiences by their most intense moment and how they ended.
              Higher score means your feed is more weighted toward engagement-bait.
            </p>
          </div>
        </div>
      </section>

      {/* Why I built this */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-stone-800">Why I built this</h2>
            <a
              href="/my-motivation.pdf"
              target="_blank"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors underline"
            >
              Read the full essay
            </a>
          </div>

          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              A series of personal events drew my attention to the mind. After taking a class
              on modeling human behavior, I threw myself into computational neuroscience and
              started reading everything I could get my hands on.
            </p>
            <p>
              The field can sound boring until you remember what it actually gets used for.
              In its more nefarious form, it crafts the algorithms and systems that exploit
              every manner of our mind as efficiently as possible. This is what's called
              the race to the brainstem—the hunt for the most effective way to hijack our
              most basic instincts.
            </p>
            <p>
              I intend to be on the other side of that race. Building toward a society where
              technology helps us instead of preying on us. This tool is a small piece of that:
              making visible what usually stays hidden.
            </p>
          </div>
        </div>
      </section>

      {/* Caveats */}
      <section className="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-xl font-medium text-stone-800 mb-6">A few caveats</h2>

          <div className="space-y-4 text-stone-600 leading-relaxed">
            <p>
              This is a toy, not science. All the thresholds are rough guesses. The scoring
              dimensions come from psychology research on social media effects, but I'm not
              claiming this is rigorous. I built it because I was curious, and I thought
              other people might be too.
            </p>
            <p>
              I could be wrong about what any of this means. But I do think it's worth
              thinking about what we consume without choosing to—what catches our eye
              before we even decide if we want to see it. That felt worth exploring.
            </p>
            <p>
              If you have thoughts about this, I'd actually love to hear them.
              What surprised you about your results? What didn't? Reach out at{" "}
              <a href="mailto:Beaum045@umn.edu" className="text-stone-800 underline hover:text-stone-600">
                Beaum045@umn.edu
              </a>
              —I respond to everything.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section id="subscribe" className="py-12 px-6 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-xl font-medium text-stone-800 mb-3">Get notified when I post something new</h2>
          <p className="text-stone-600 mb-6">
            I'll send you a quick summary so you can decide if it's worth your time. No spam.
          </p>

          {status === "success" ? (
            <p className="text-stone-700 font-medium">{message}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="px-6 py-3 bg-stone-800 text-white rounded-lg font-medium hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm mt-2">{message}</p>
          )}
        </div>
      </section>

      {/* Privacy & Footer */}
      <footer className="py-8 px-6 border-t border-stone-200">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-stone-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-stone-600">
              <strong className="text-stone-700">Privacy:</strong> I don't collect your data.
              Your video is processed and deleted immediately. I don't store your recordings,
              I don't look at what you scroll through, and I have no interest in keeping any of it.
            </p>
          </div>
          <p className="text-sm text-stone-500 text-center">
            Built by Will Beaumaster · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
