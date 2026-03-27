import { NextResponse } from "next/server"
import { appointmentSchema } from "@/lib/validations"
import type { Appointment } from "@/lib/types"

// In-memory storage for demo purposes
// Replace with your database integration
const appointments: Appointment[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = appointmentSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { patientName, email, phone, doctorId, date, time, type, reason } = validationResult.data

    // Check for conflicting appointments
    // TODO: Implement proper conflict checking with database
    const hasConflict = appointments.some(
      (apt) => 
        apt.doctorId === doctorId && 
        apt.date === date && 
        apt.time === time &&
        apt.status !== "cancelled"
    )

    if (hasConflict) {
      return NextResponse.json(
        { success: false, error: "This time slot is no longer available" },
        { status: 409 }
      )
    }

    // Create new appointment
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      patientId: crypto.randomUUID(), // TODO: Get from authenticated user
      doctorId: doctorId || "unassigned",
      date,
      time,
      type: type as Appointment["type"],
      status: "scheduled",
      reason,
      notes: `Patient: ${patientName}, Email: ${email}, Phone: ${phone}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store the appointment
    // TODO: Replace with actual database call
    appointments.push(appointment)

    // TODO: Send confirmation email to patient
    // await sendAppointmentConfirmation(email, appointment)

    // TODO: Notify doctor/admin
    // await notifyDoctor(doctorId, appointment)

    // TODO: Add to calendar integration
    // await addToCalendar(appointment)

    return NextResponse.json(
      {
        success: true,
        data: appointment,
        message: "Appointment scheduled successfully!",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Appointment API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to schedule appointment" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const patientId = searchParams.get("patientId")
    const doctorId = searchParams.get("doctorId")

    // Filter appointments
    // TODO: Replace with database query
    let filtered = [...appointments]

    if (status) {
      filtered = filtered.filter((apt) => apt.status === status)
    }
    if (patientId) {
      filtered = filtered.filter((apt) => apt.patientId === patientId)
    }
    if (doctorId) {
      filtered = filtered.filter((apt) => apt.doctorId === doctorId)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
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
    console.error("Get Appointments Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    )
  }
}
