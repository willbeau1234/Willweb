import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      )
    }

    // Add to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (!audienceId) {
      console.error("RESEND_AUDIENCE_ID not set")
      return NextResponse.json(
        { error: "Newsletter not configured" },
        { status: 500 }
      )
    }

    await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })

    // Send welcome email
    await resend.emails.send({
      from: "Will Beaumaster <hello@willbeaumaster.com>",
      to: email,
      subject: "You're in",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #44403c;">
          <p style="font-size: 16px; line-height: 1.6;">Hey,</p>
          <p style="font-size: 16px; line-height: 1.6;">Thanks for subscribing. I'll send you a quick note whenever I publish something new—usually a brief summary so you can decide if it's worth your time.</p>
          <p style="font-size: 16px; line-height: 1.6;">No spam, no marketing. Just the occasional "hey, I made a thing."</p>
          <p style="font-size: 16px; line-height: 1.6; margin-top: 32px;">— Will</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
