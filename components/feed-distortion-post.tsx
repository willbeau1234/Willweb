"use client"

export function FeedDistortionPost() {
  const appUrl = "https://feed-distortion-app-production.up.railway.app"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-800/50">
        <div className="container mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Feed Distortion Index</span>
          </div>
          <a
            href="https://willbeaumaster.com"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            by Will Beaumaster
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            See what your brain
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              actually wants
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Record yourself scrolling Instagram. This tool detects which posts
            you pause on and scores your feed on cognitive dimensions.
          </p>
        </div>
      </section>

      {/* App embed */}
      <section className="px-6 pb-16">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-700/50">
            <iframe
              src={appUrl}
              className="w-full bg-white"
              style={{ height: "900px" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 border-t border-slate-800/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-12 text-center">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-400 font-semibold">1</span>
              </div>
              <h3 className="text-white font-medium mb-2">Record your scroll</h3>
              <p className="text-sm text-slate-400">
                Screen record yourself browsing Instagram, TikTok, or LinkedIn for 30-60 seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-400 font-semibold">2</span>
              </div>
              <h3 className="text-white font-medium mb-2">Detect pauses</h3>
              <p className="text-sm text-slate-400">
                Phase correlation finds every moment you stopped scrolling to look at something.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-400 font-semibold">3</span>
              </div>
              <h3 className="text-white font-medium mb-2">Score content</h3>
              <p className="text-sm text-slate-400">
                A vision model scores each post on appearance, emotional intensity, and aspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What we measure</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Appearance", desc: "Focus on beauty, fashion, body image" },
              { name: "Idealization", desc: "How polished vs. raw the content is" },
              { name: "Arousal", desc: "Emotional intensity and activation" },
              { name: "Negativity", desc: "Negative emotional tone" },
              { name: "Aspiration", desc: "Lifestyle envy, luxury, success" },
            ].map((dim) => (
              <div
                key={dim.name}
                className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
              >
                <h3 className="text-white font-medium mb-1">{dim.name}</h3>
                <p className="text-sm text-slate-500">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/50">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-slate-500">
            A curiosity project. Not calibrated science.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Built by Will Beaumaster
          </p>
        </div>
      </footer>
    </div>
  )
}
