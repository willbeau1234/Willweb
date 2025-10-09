import { Card } from "@/components/ui/card"
import { Calendar, Clock, BookOpen } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "Story of the Week",
    excerpt:
      "Thoughts, interesting stories, and reflections from my journey. Click to read this week's story.",
    date: new Date().toISOString().split('T')[0],
    readTime: "5 min read",
    category: "Stories & Thoughts",
    link: "/story-of-the-week.html"
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-blue-400">Stories & Thoughts</h2>
          </div>
          <p className="text-lg text-blue-400 max-w-2xl mx-auto">
            Personal reflections, interesting stories, and thoughts beyond the code
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {blogPosts.map((post) => (
              <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer">
                <Card className="group p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="mb-4">
                    <span className="text-xs font-medium text-primary">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-balance">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
