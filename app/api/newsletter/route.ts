import { NextResponse } from "next/server"
import { newsletterSchema } from "@/lib/validations"
import type { NewsletterSubscription } from "@/lib/types"

// In-memory storage for demo purposes
// Replace with your database integration
const subscriptions: NewsletterSubscription[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = newsletterSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Check if already subscribed
    const existing = subscriptions.find(
      (sub) => sub.email === email && sub.status === "active"
    )
    if (existing) {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      )
    }

    // Create new subscription
    const subscription: NewsletterSubscription = {
      id: crypto.randomUUID(),
      email,
      subscribedAt: new Date().toISOString(),
      status: "active",
    }

    // Store the subscription
    // TODO: Replace with actual database call
    subscriptions.push(subscription)

    // TODO: Send welcome email
    // await sendWelcomeEmail(email)

    // TODO: Add to email marketing service (Mailchimp, Resend, etc.)
    // await addToMailingList(email)

    return NextResponse.json(
      {
        success: true,
        data: { id: subscription.id },
        message: "Successfully subscribed to the newsletter!",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Newsletter API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Find and update subscription status
    const subscription = subscriptions.find((sub) => sub.email === email)
    if (subscription) {
      subscription.status = "unsubscribed"
    }

    // TODO: Update in database
    // TODO: Remove from email marketing service

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from the newsletter",
    })
  } catch (error) {
    console.error("Newsletter Unsubscribe Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}
