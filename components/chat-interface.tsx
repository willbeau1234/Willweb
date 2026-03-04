"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Send, Sparkles, Zap } from "lucide-react"
import { findCachedResponse } from "@/lib/cached-prompts"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  cached?: boolean // Track if response came from cache
}

const exampleQuestions = [
  "Should I hire Will?",
  "What makes Will different?",
  "What are Will's core technical skills?",
  "When is Will available?",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Will's AI assistant. Ask me anything about his work, expertise, or how AI can help your business. Please note that responses may not always be accurate.",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim()) return

    const userInput = input
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setInput("")

    // Check cache first
    const cachedResponse = findCachedResponse(userInput)

    if (cachedResponse) {
      // Add slight delay to mimic LLM response (300-600ms)
      const delay = 300 + Math.random() * 300
      await new Promise(resolve => setTimeout(resolve, delay))

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: cachedResponse,
          cached: true,
        },
      ])
      return
    }

    // Fall back to LLM if no cache hit
    // Add placeholder message for streaming
    const assistantMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        cached: false,
      },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          history: updatedMessages
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk

        // Update message with streamed content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullContent }
              : msg
          )
        )
      }

      // Final update to ensure complete message
      if (!fullContent) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: "Sorry, I couldn't generate a response." }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, there was an error processing your request." }
            : msg
        )
      )
    }
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
  }

  return (
    <Card className="max-w-4xl mx-auto bg-card border-border shadow-2xl">
      <div className="flex flex-col h-[600px]">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  message.cached ? (
                    <Zap className="inline-block w-4 h-4 mr-2 mb-1 text-yellow-500" />
                  ) : (
                    <Sparkles className="inline-block w-4 h-4 mr-2 mb-1" />
                  )
                )}
                <span className="text-sm leading-relaxed">{message.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Example questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="text-xs px-3 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={handleSend} size="icon" className="rounded-xl h-12 w-12">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI responses may not always be accurate. Please verify important information.
          </p>
        </div>
      </div>
    </Card>
  )
}
