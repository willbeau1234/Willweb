import Image from "next/image"

export function FeedDistortionPost() {
  return (
    <section id="feed-distortion" className="py-16 px-6">
      <div className="container mx-auto max-w-3xl">
        <article>
          <header className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">June 2026</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              I Built a Tool to See What My Brain Actually Wants on Instagram
            </h1>
            <p className="text-muted-foreground">
              Turns out I scroll past travel content but stop for memes. Who knew.
            </p>
          </header>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p>
              I recorded myself scrolling Instagram for a few minutes, then wrote some code
              to figure out which posts I actually stopped on vs. which ones I just flew past.
            </p>

            <p>
              The idea is simple: if you pause on something, your brain found it interesting
              (or outrageous, or confusing). If you scroll right by, you didn&apos;t care.
              The tool watches for those pauses and scores each post on things like
              novelty, social comparison, and emotional pull.
            </p>

            <div className="my-8 rounded-lg overflow-hidden border border-gray-700">
              <Image
                src="/feed-distortion-report.png"
                alt="Feed Distortion Index report showing scroll behavior analysis"
                width={800}
                height={1200}
                className="w-full h-auto"
              />
            </div>

            <p>
              The left side shows each post I stopped on during my scroll session.
              The right shows my overall &quot;Feed Distortion Index&quot; - basically a score
              of how much the algorithm is feeding me engagement-bait vs. stuff
              I&apos;d actually choose to see.
            </p>

            <p>
              Some findings from my own feed:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>I stop on comedy and memes way more than I thought I did</li>
              <li>Travel and lifestyle content? I scroll right past most of it</li>
              <li>Outrage content gets me to pause even when I don&apos;t want it to</li>
            </ul>

            <p>
              The tech is nothing fancy - phase correlation to detect when the screen
              stops moving (harder than you&apos;d think because videos autoplay), then
              a vision model to categorize each paused post. All the thresholds are
              rough guesses, not calibrated science.
            </p>

            <p>
              It&apos;s a toy, not a research instrument. But it was fun to build and
              mildly unsettling to see my attention patterns laid out like that.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
