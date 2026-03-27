import { NextResponse } from "next/server"
import type { Appointment, AppointmentStatus } from "@/lib/types"

// Reference to the same in-memory storage
// In production, this would be a database query
const appointments: Appointment[] = []

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // TODO: Replace with database query
    const appointment = appointments.find((apt) => apt.id === id)

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    console.error("Get Appointment Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointment" },
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

    // TODO: Replace with database query and update
    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      )
    }

    // Validate status if provided
    const validStatuses: AppointmentStatus[] = [
      "scheduled",
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
      "no-show",
    ]

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      )
    }

    // Update appointment
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    appointments[appointmentIndex] = updatedAppointment

    // TODO: Send notification to patient about update
    // await notifyPatientUpdate(updatedAppointment)

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      message: "Appointment updated successfully",
    })
  } catch (error) {
    console.error("Update Appointment Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update appointment" },
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

    // TODO: Replace with database query
    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      )
    }

    // Soft delete - update status to cancelled
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    }

    // TODO: Send cancellation notification
    // await sendCancellationEmail(appointments[appointmentIndex])

    // TODO: Free up calendar slot
    // await removeFromCalendar(id)

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
    })
  } catch (error) {
    console.error("Cancel Appointment Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to cancel appointment" },
      { status: 500 }
    )
  }
}
