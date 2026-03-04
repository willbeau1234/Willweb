import { NextRequest } from 'next/server'

export const maxDuration = 120 // Allow longer timeout for warmup

export async function POST(request: NextRequest) {
  const MODAL_ENDPOINT = process.env.MODAL_ENDPOINT || 'https://beaum045--unsloth-model-model-serve.modal.run'

  try {
    // Send a simple warmup request to Modal
    // This triggers the container to start and load the model
    const response = await fetch(MODAL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'warmup'
      }),
    })

    if (response.ok) {
      return new Response(JSON.stringify({ status: 'warm' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      return new Response(JSON.stringify({ status: 'warming' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    // Even if it times out, the container is likely warming up
    return new Response(JSON.stringify({ status: 'warming' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
