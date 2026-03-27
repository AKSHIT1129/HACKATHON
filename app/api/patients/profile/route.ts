import { NextResponse } from "next/server"
import type { Patient } from "@/lib/types"

// Reference to in-memory storage
const patients: Patient[] = []

// TODO: Implement actual authentication
async function getAuthenticatedPatient(
  _request: Request
): Promise<Patient | null> {
  // This is a placeholder - implement real auth
  // const session = await getSession(request)
  // if (!session) return null
  // return patients.find(p => p.id === session.userId) || null

  // For demo, return first patient if exists
  return patients[0] || null
}

export async function GET(request: Request) {
  try {
    // Get authenticated patient
    const patient = await getAuthenticatedPatient(request)

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Return patient profile (without sensitive data)
    return NextResponse.json({
      success: true,
      data: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        address: patient.address,
        medicalHistory: patient.medicalHistory,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
    })
  } catch (error) {
    console.error("Get Profile Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    // Get authenticated patient
    const patient = await getAuthenticatedPatient(request)

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Fields that can be updated
    const allowedFields = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "medicalHistory",
    ]

    // Filter out non-allowed fields
    const updates: Partial<Patient> = {}
    for (const field of allowedFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field]
      }
    }

    // Update patient
    // TODO: Replace with database update
    const patientIndex = patients.findIndex((p) => p.id === patient.id)
    if (patientIndex !== -1) {
      patients[patientIndex] = {
        ...patients[patientIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    }

    return NextResponse.json({
      success: true,
      data: patients[patientIndex],
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update Profile Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
