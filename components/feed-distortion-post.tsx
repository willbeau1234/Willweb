"use client"

export function FeedDistortionPost() {
  const appUrl = "https://feed-distortion-app-production.up.railway.app"

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Decorative top border */}
      <div className="h-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700" />

      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="container mx-auto max-w-5xl px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-amber-700 flex items-center justify-center bg-stone-100">
              <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-serif font-semibold text-stone-800 tracking-wide">Feed Distortion Index</span>
              <p className="text-xs text-stone-500 tracking-widest uppercase">An Instrument of Self-Knowledge</p>
            </div>
          </div>
          <a
            href="https://willbeaumaster.com"
            className="text-sm text-stone-500 hover:text-amber-700 transition-colors font-serif italic"
          >
            Will Beaumaster
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-28 px-8 bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-amber-700 text-sm tracking-widest uppercase mb-6 font-medium">Attention & Cognition</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 mb-8 leading-tight">
            Know Thyself Through
            <span className="block italic text-amber-800">What Captures Thee</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-serif">
            Record your passage through the infinite scroll. This instrument reveals
            which images arrest your gaze and measures them against the classical dimensions of cognitive capture.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
          </div>
        </div>
      </section>

      {/* App embed */}
      <section className="px-8 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-sm overflow-hidden shadow-xl border-4 border-double border-stone-300 bg-white">
            <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-600" />
              <span className="text-xs text-stone-500 font-serif tracking-wide">The Apparatus</span>
            </div>
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
      <section className="py-20 px-8 bg-stone-100 border-y border-stone-200">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-amber-700 text-xs tracking-widest uppercase mb-3">Methodology</p>
            <h2 className="text-3xl font-serif text-stone-800">The Threefold Process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-700/30 flex items-center justify-center mx-auto mb-6 bg-stone-50">
                <span className="text-2xl font-serif text-amber-800">I</span>
              </div>
              <h3 className="text-lg font-serif text-stone-800 mb-3">Capture the Journey</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Record thy passage through the feeds of Instagram, TikTok, or LinkedIn for thirty to sixty seconds.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-700/30 flex items-center justify-center mx-auto mb-6 bg-stone-50">
                <span className="text-2xl font-serif text-amber-800">II</span>
              </div>
              <h3 className="text-lg font-serif text-stone-800 mb-3">Discern the Pauses</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Phase correlation algorithms identify each moment thy scroll ceased—where attention was arrested.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-amber-700/30 flex items-center justify-center mx-auto mb-6 bg-stone-50">
                <span className="text-2xl font-serif text-amber-800">III</span>
              </div>
              <h3 className="text-lg font-serif text-stone-800 mb-3">Measure the Soul</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                A vision model scores each captured image across dimensions of beauty, intensity, and aspiration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-20 px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-amber-700 text-xs tracking-widest uppercase mb-3">The Five Dimensions</p>
            <h2 className="text-3xl font-serif text-stone-800">Categories of Cognitive Capture</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Appearance", latin: "Forma", desc: "The pull of beauty, fashion, and corporeal presentation" },
              { name: "Idealization", latin: "Perfectio", desc: "The polish of curation versus the rawness of truth" },
              { name: "Arousal", latin: "Excitatio", desc: "The intensity of emotional activation and stimulation" },
              { name: "Negativity", latin: "Tristitia", desc: "The shadow of anger, sorrow, and discontent" },
              { name: "Aspiration", latin: "Desiderium", desc: "The longing for status, luxury, and achievement" },
            ].map((dim) => (
              <div
                key={dim.name}
                className="p-6 bg-stone-50 border border-stone-200 rounded-sm hover:border-amber-600/30 transition-colors"
              >
                <p className="text-xs text-amber-700 tracking-widest uppercase mb-1">{dim.latin}</p>
                <h3 className="text-lg font-serif text-stone-800 mb-2">{dim.name}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-8 bg-amber-50 border-y border-amber-100">
        <div className="container mx-auto max-w-2xl text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-stone-700 leading-relaxed">
            "The unexamined feed is not worth scrolling."
          </blockquote>
          <p className="mt-4 text-sm text-stone-500 tracking-wide">— Adapted from Socrates</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-stone-100 border-t border-stone-200">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center mx-auto mb-6 bg-stone-50">
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-sm text-stone-500 font-serif">
            An instrument of curiosity, not of science.
          </p>
          <p className="text-xs text-stone-400 mt-2 tracking-wide">
            Crafted by Will Beaumaster · MMXXVI
          </p>
        </div>
      </footer>

      {/* Decorative bottom border */}
      <div className="h-2 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700" />
    </div>
  )
}
