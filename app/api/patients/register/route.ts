import { NextResponse } from "next/server"
import { patientRegistrationSchema } from "@/lib/validations"
import type { Patient } from "@/lib/types"

// In-memory storage for demo
// Replace with database integration
const patients: Patient[] = []
const passwordHashes: Record<string, string> = {}

// Simple hash function for demo - use bcrypt in production
function simpleHash(password: string): string {
  // TODO: Replace with bcrypt
  // import bcrypt from 'bcrypt'
  // return await bcrypt.hash(password, 10)
  return Buffer.from(password).toString("base64")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = patientRegistrationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, dateOfBirth, gender, password } =
      validationResult.data

    // Check if email already exists
    const existingPatient = patients.find((p) => p.email === email)
    if (existingPatient) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Create new patient
    const patient: Patient = {
      id: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store patient and password hash
    // TODO: Replace with actual database calls
    patients.push(patient)
    passwordHashes[patient.id] = simpleHash(password)

    // TODO: Send verification email
    // await sendVerificationEmail(email, patient.id)

    // TODO: Create session/JWT token
    // const token = await createSession(patient.id)

    // Return patient data (without sensitive info)
    return NextResponse.json(
      {
        success: true,
        data: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
        },
        message: "Registration successful! Please verify your email.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Patient Registration Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to register" },
      { status: 500 }
    )
  }
}
