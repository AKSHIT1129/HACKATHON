import { NextResponse } from "next/server"
import { healthRecordSchema } from "@/lib/validations"
import type { HealthRecord } from "@/lib/types"

// In-memory storage for demo
const healthRecords: HealthRecord[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = healthRecordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { patientId, type, title, description, date } = validationResult.data

    // TODO: Verify patient exists
    // TODO: Verify user has permission to create record for this patient

    // Create new health record
    const record: HealthRecord = {
      id: crypto.randomUUID(),
      patientId,
      type,
      title,
      description,
      date,
      attachments: [],
      createdBy: "system", // TODO: Get from authenticated user
      createdAt: new Date().toISOString(),
    }

    // Store the record
    // TODO: Replace with actual database call
    healthRecords.push(record)

    return NextResponse.json(
      {
        success: true,
        data: record,
        message: "Health record created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create Health Record Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create health record" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const type = searchParams.get("type")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // TODO: Add authentication check
    // TODO: Verify user has permission to view these records

    if (!patientId) {
      return NextResponse.json(
        { success: false, error: "Patient ID is required" },
        { status: 400 }
      )
    }

    // Filter records
    let filtered = healthRecords.filter((r) => r.patientId === patientId)

    if (type) {
      filtered = filtered.filter((r) => r.type === type)
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Paginate
    const total = filtered.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filtered.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get Health Records Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch health records" },
      { status: 500 }
    )
  }
}
