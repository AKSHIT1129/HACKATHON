import { NextResponse } from "next/server"
import type { Doctor } from "@/lib/types"

// Sample doctors data for demo
// Replace with database integration
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
  {
    id: "dr-004",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@medicare-ai.com",
    phone: "+1 (555) 101-0004",
    specialization: "Dermatology",
    qualifications: ["MD", "FAAD", "Board Certified Dermatologist"],
    experience: 10,
    availability: [
      { day: "Monday", startTime: "10:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "10:00", endTime: "18:00" },
      { day: "Friday", startTime: "10:00", endTime: "14:00" },
    ],
    rating: 4.7,
    reviewCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "dr-005",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@medicare-ai.com",
    phone: "+1 (555) 101-0005",
    specialization: "Orthopedics",
    qualifications: ["MD", "FAAOS", "Sports Medicine Fellowship"],
    experience: 20,
    availability: [
      { day: "Monday", startTime: "07:00", endTime: "15:00" },
      { day: "Tuesday", startTime: "07:00", endTime: "15:00" },
      { day: "Thursday", startTime: "07:00", endTime: "15:00" },
    ],
    rating: 4.8,
    reviewCount: 278,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const specialization = searchParams.get("specialization")
    const search = searchParams.get("search")

    // Filter doctors
    let filtered = [...doctors]

    if (specialization) {
      filtered = filtered.filter(
        (doc) => doc.specialization.toLowerCase() === specialization.toLowerCase()
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.firstName.toLowerCase().includes(searchLower) ||
          doc.lastName.toLowerCase().includes(searchLower) ||
          doc.specialization.toLowerCase().includes(searchLower)
      )
    }

    // Sort by rating (highest first)
    filtered.sort((a, b) => b.rating - a.rating)

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
    console.error("Get Doctors Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}

// Get unique specializations
export async function OPTIONS() {
  const specializations = [...new Set(doctors.map((doc) => doc.specialization))]
  
  return NextResponse.json({
    success: true,
    data: specializations,
  })
}
