import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations"
import type { ContactInquiry } from "@/lib/types"

// In-memory storage for demo purposes
// Replace with your database integration (Supabase, Neon, etc.)
const contactInquiries: ContactInquiry[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = contactSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = validationResult.data

    // Create new inquiry
    const inquiry: ContactInquiry = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      subject,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    }

    // Store the inquiry
    // TODO: Replace with actual database call
    contactInquiries.push(inquiry)

    // TODO: Send email notification to admin
    // await sendEmailNotification(inquiry)

    // TODO: Send confirmation email to user
    // await sendConfirmationEmail(email, name)

    return NextResponse.json(
      {
        success: true,
        data: { id: inquiry.id },
        message: "Your inquiry has been received. We will contact you soon.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Contact API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Protected route - implement authentication before enabling
  // TODO: Add authentication check
  
  return NextResponse.json({
    success: true,
    data: contactInquiries,
    pagination: {
      page: 1,
      limit: 10,
      total: contactInquiries.length,
      totalPages: Math.ceil(contactInquiries.length / 10),
    },
  })
}
