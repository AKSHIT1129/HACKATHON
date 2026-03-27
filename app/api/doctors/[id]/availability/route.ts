import { NextResponse } from "next/server"

// Sample time slots generator
function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = []
  const start = parseInt(startTime.split(":")[0])
  const end = parseInt(endTime.split(":")[0])

  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
    slots.push(`${hour.toString().padStart(2, "0")}:30`)
  }

  return slots
}

// Doctor availability data
const doctorAvailability: Record<string, { day: string; startTime: string; endTime: string }[]> = {
  "dr-001": [
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
    { day: "Friday", startTime: "09:00", endTime: "13:00" },
  ],
  "dr-002": [
    { day: "Monday", startTime: "08:00", endTime: "16:00" },
    { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
    { day: "Thursday", startTime: "08:00", endTime: "16:00" },
  ],
  "dr-003": [
    { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", startTime: "09:00", endTime: "17:00" },
  ],
}

// Booked slots (in production, this would come from the database)
const bookedSlots: Record<string, string[]> = {}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date parameter is required" },
        { status: 400 }
      )
    }

    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    })

    // Get doctor's availability
    const availability = doctorAvailability[id]
    if (!availability) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      )
    }

    // Find schedule for the requested day
    const daySchedule = availability.find((avail) => avail.day === dayOfWeek)

    if (!daySchedule) {
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          message: `Doctor is not available on ${dayOfWeek}s`,
          slots: [],
        },
      })
    }

    // Generate available time slots
    const allSlots = generateTimeSlots(daySchedule.startTime, daySchedule.endTime)

    // Get booked slots for this doctor on this date
    // TODO: Replace with database query
    const bookedForDate = bookedSlots[`${id}-${date}`] || []

    // Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedForDate.includes(slot)
    )

    return NextResponse.json({
      success: true,
      data: {
        available: true,
        date,
        dayOfWeek,
        workingHours: {
          start: daySchedule.startTime,
          end: daySchedule.endTime,
        },
        slots: availableSlots.map((time) => ({
          time,
          available: true,
        })),
        bookedCount: bookedForDate.length,
        totalSlots: allSlots.length,
      },
    })
  } catch (error) {
    console.error("Get Availability Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}
