"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileText, ExternalLink } from "lucide-react"

export function ResumeSection() {
  const handleViewResume = () => {
    window.open("/Will's Resume .pdf", "_blank")
  }

  const handleDownloadResume = () => {
    const link = document.createElement("a")
    link.href = "/Will's Resume .pdf"
    link.download = "Will_Beaumaster_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="resume" className="relative py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold">Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    View my professional experience
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleViewResume}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </Button>

                <Button
                  onClick={handleDownloadResume}
                  size="sm"
                  variant="outline"
                  className="gap-2 border-purple-500/50 hover:bg-purple-500/10"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
