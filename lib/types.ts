// Patient types
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address?: Address
  medicalHistory?: MedicalHistory
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface MedicalHistory {
  allergies: string[]
  medications: string[]
  conditions: string[]
  surgeries: string[]
  familyHistory: string[]
}

// Appointment types
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: string
  time: string
  type: AppointmentType
  status: AppointmentStatus
  reason: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export type AppointmentType = 
  | "consultation" 
  | "follow-up" 
  | "checkup" 
  | "emergency" 
  | "telemedicine"

export type AppointmentStatus = 
  | "scheduled" 
  | "confirmed" 
  | "in-progress" 
  | "completed" 
  | "cancelled" 
  | "no-show"

// Doctor types
export interface Doctor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  specialization: string
  qualifications: string[]
  experience: number
  availability: Availability[]
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface Availability {
  day: string
  startTime: string
  endTime: string
}

// AI Diagnosis types
export interface SymptomInput {
  symptoms: string[]
  duration: string
  severity: "mild" | "moderate" | "severe"
  additionalNotes?: string
}

export interface DiagnosisResult {
  id: string
  possibleConditions: PossibleCondition[]
  recommendedActions: string[]
  urgencyLevel: "low" | "medium" | "high" | "emergency"
  disclaimers: string[]
  createdAt: string
}

export interface PossibleCondition {
  name: string
  probability: number
  description: string
  commonSymptoms: string[]
}

// Contact/Inquiry types
export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "in-progress" | "resolved"
  createdAt: string
}

// Newsletter Subscription
export interface NewsletterSubscription {
  id: string
  email: string
  subscribedAt: string
  status: "active" | "unsubscribed"
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Health Records
export interface HealthRecord {
  id: string
  patientId: string
  type: "lab-result" | "imaging" | "prescription" | "clinical-note"
  title: string
  description: string
  date: string
  attachments?: string[]
  createdBy: string
  createdAt: string
}

// Chat/Telemedicine
export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: "text" | "image" | "file"
  timestamp: string
  read: boolean
}

export interface TelemedicineSession {
  id: string
  appointmentId: string
  patientId: string
  doctorId: string
  status: "waiting" | "active" | "ended"
  startTime?: string
  endTime?: string
  roomUrl?: string
}
