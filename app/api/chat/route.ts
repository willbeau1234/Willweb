import { NextRequest } from 'next/server'

export const maxDuration = 60 // Set timeout to 60 seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Modal endpoint URL
    const MODAL_ENDPOINT = process.env.MODAL_ENDPOINT || 'https://beaum045--unsloth-model-fastapi-app.modal.run'

    console.log('Calling Modal endpoint:', MODAL_ENDPOINT)
    console.log('Message:', message)

    const response = await fetch(MODAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message
      }),
    })

    console.log('Modal response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Modal API error: ${response.status} - ${errorText}`)
      throw new Error(`Modal API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Modal response data:', data)

    const responseText = data.response || ''

    // Stream the response word by word for better UX
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(' ')
        for (let i = 0; i < words.length; i++) {
          const word = words[i]
          const chunk = i === 0 ? word : ' ' + word
          controller.enqueue(encoder.encode(chunk))
          // Small delay between words for natural feel
          await new Promise(resolve => setTimeout(resolve, 30))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)

    // Return error as streamed response for consistency
    const errorMessage = `Error: ${error instanceof Error ? error.message : 'Unknown error'}. The model may be starting up (first request takes ~15 seconds).`

    return new Response(errorMessage, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}