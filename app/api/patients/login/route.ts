import { NextResponse } from "next/server"
import { loginSchema } from "@/lib/validations"
import type { Patient } from "@/lib/types"

// Reference to in-memory storage
// Replace with database integration
const patients: Patient[] = []
const passwordHashes: Record<string, string> = {}

// Simple hash function for demo - use bcrypt in production
function simpleHash(password: string): string {
  return Buffer.from(password).toString("base64")
}

// Verify password - use bcrypt.compare in production
function verifyPassword(password: string, hash: string): boolean {
  // TODO: Replace with bcrypt.compare
  return simpleHash(password) === hash
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Find patient by email
    // TODO: Replace with database query
    const patient = patients.find((p) => p.email === email)

    if (!patient) {
      // Use generic message for security
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const passwordHash = passwordHashes[patient.id]
    if (!passwordHash || !verifyPassword(password, passwordHash)) {
      // TODO: Implement rate limiting and account lockout
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // TODO: Create session or JWT token
    // const token = await createSession(patient.id)
    // const refreshToken = await createRefreshToken(patient.id)

    // TODO: Set HTTP-only cookies
    // const response = NextResponse.json(...)
    // response.cookies.set('session', token, { httpOnly: true, secure: true })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
        },
        // token, // Include when auth is implemented
      },
      message: "Login successful",
    })
  } catch (error) {
    console.error("Patient Login Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to login" },
      { status: 500 }
    )
  }
}
