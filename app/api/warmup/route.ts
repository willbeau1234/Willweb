export async function POST() {
  const MODAL_ENDPOINT = process.env.MODAL_ENDPOINT || 'https://beaum045--unsloth-model-model-serve.modal.run'

  try {
    // Hit the health endpoint to trigger container startup
    // This is faster than a full inference request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(`${MODAL_ENDPOINT}/health`, {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return new Response(JSON.stringify({ status: 'warm' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch {
    // Ignore errors - the request still triggers container startup
  }

  // Return warming status - container is starting up
  return new Response(JSON.stringify({ status: 'warming' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
