import { NextResponse } from "next/server"
import type { Doctor } from "@/lib/types"

// Sample doctors data - same as parent route
// In production, this would be a database query
const doctors: Doctor[] = [
  {
    id: "dr-001",
    firstName: "Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@medicare-ai.com",
    phone: "+1 (555) 101-0001",
    specialization: "Cardiology",
    qualifications: ["MD", "FACC", "Board Certified Cardiologist"],
    experience: 15,
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "13:00" },
    ],
    rating: 4.9,
    reviewCount: 245,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dr-002",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@medicare-ai.com",
    phone: "+1 (555) 101-0002",
    specialization: "Family Medicine",
    qualifications: ["MD", "ABFM Board Certified"],
    experience: 12,
    availability: [
      { day: "Monday", startTime: "08:00", endTime: "16:00" },
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "Thursday", startTime: "08:00", endTime: "16:00" },
    ],
    rating: 4.8,
    reviewCount: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dr-003",
    firstName: "Robert",
    lastName: "Kim",
    email: "robert.kim@medicare-ai.com",
    phone: "+1 (555) 101-0003",
    specialization: "Pediatrics",
    qualifications: ["MD", "FAAP", "Pediatric Critical Care"],
    experience: 18,
    availability: [
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
    ],
    rating: 4.9,
    reviewCount: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Replace with database query
    const doctor = doctors.find((doc) => doc.id === id)

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    })
  } catch (error) {
    console.error("Get Doctor Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor" },
      { status: 500 }
    )
  }
}
