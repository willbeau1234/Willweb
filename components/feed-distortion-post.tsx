"use client"

export function FeedDistortionPost() {
  const appUrl = "https://feed-distortion-app-production.up.railway.app"

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="container mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
          <span className="text-lg font-medium text-stone-800">Feed Distortion Index</span>
          <a
            href="https://willbeaumaster.com"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            Will Beaumaster
          </a>
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
              href="/feed-distortion-methodology.tex"
              download
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors underline"
            >
              Download the full methodology (LaTeX)
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

      {/* Caveats */}
      <section className="py-12 px-6">
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
              What surprised you about your results? What didn't?
            </p>
          </div>
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
