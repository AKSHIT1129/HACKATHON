import { NextResponse } from "next/server"
import type { HealthRecord } from "@/lib/types"

// Reference to in-memory storage
const healthRecords: HealthRecord[] = []

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Add authentication check
    // TODO: Verify user has permission to view this record

    const record = healthRecords.find((r) => r.id === id)

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Health record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    console.error("Get Health Record Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch health record" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // TODO: Add authentication check
    // TODO: Verify user has permission to update this record

    const recordIndex = healthRecords.findIndex((r) => r.id === id)

    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Health record not found" },
        { status: 404 }
      )
    }

    // Fields that can be updated
    const allowedFields = ["title", "description", "attachments"]

    // Filter out non-allowed fields
    const updates: Partial<HealthRecord> = {}
    for (const field of allowedFields) {
      if (field in body) {
        (updates as Record<string, unknown>)[field] = body[field]
      }
    }

    // Update record
    healthRecords[recordIndex] = {
      ...healthRecords[recordIndex],
      ...updates,
    }

    return NextResponse.json({
      success: true,
      data: healthRecords[recordIndex],
      message: "Health record updated successfully",
    })
  } catch (error) {
    console.error("Update Health Record Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update health record" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Add authentication check
    // TODO: Verify user has permission to delete this record
    // TODO: Consider soft delete instead of hard delete

    const recordIndex = healthRecords.findIndex((r) => r.id === id)

    if (recordIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Health record not found" },
        { status: 404 }
      )
    }

    // Remove record
    healthRecords.splice(recordIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Health record deleted successfully",
    })
  } catch (error) {
    console.error("Delete Health Record Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete health record" },
      { status: 500 }
    )
  }
}
