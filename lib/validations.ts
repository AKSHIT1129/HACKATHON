import { z } from "zod"

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormData = z.infer<typeof contactSchema>

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

// Appointment booking validation
export const appointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  doctorId: z.string().optional(),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  type: z.enum(["consultation", "follow-up", "checkup", "emergency", "telemedicine"]),
  reason: z.string().min(10, "Please describe your reason for visit"),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

// Patient registration validation
export const patientRegistrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  dateOfBirth: z.string().min(1, "Please enter your date of birth"),
  gender: z.enum(["male", "female", "other"]),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type PatientRegistrationData = z.infer<typeof patientRegistrationSchema>

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Symptom checker validation
export const symptomCheckerSchema = z.object({
  symptoms: z.array(z.string()).min(1, "Please select at least one symptom"),
  duration: z.string().min(1, "Please specify how long you have had symptoms"),
  severity: z.enum(["mild", "moderate", "severe"]),
  additionalNotes: z.string().optional(),
})

export type SymptomCheckerData = z.infer<typeof symptomCheckerSchema>

// Health record validation
export const healthRecordSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  type: z.enum(["lab-result", "imaging", "prescription", "clinical-note"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
})

export type HealthRecordData = z.infer<typeof healthRecordSchema>
