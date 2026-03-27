import type { ApiResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

interface FetchOptions extends RequestInit {
  params?: Record<string, string>
}

/**
 * Generic API fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP error! status: ${response.status}`,
      }
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// API Methods for different endpoints

// Contact API
export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Newsletter API
export const newsletterApi = {
  subscribe: (email: string) =>
    apiFetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  unsubscribe: (email: string) =>
    apiFetch("/api/newsletter", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    }),
}

// Appointments API
export const appointmentsApi = {
  create: (data: {
    patientName: string
    email: string
    phone: string
    doctorId?: string
    date: string
    time: string
    type: string
    reason: string
  }) =>
    apiFetch("/api/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: (params?: { page?: string; limit?: string; status?: string }) =>
    apiFetch("/api/appointments", { params }),
  getById: (id: string) => apiFetch(`/api/appointments/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/api/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  cancel: (id: string) =>
    apiFetch(`/api/appointments/${id}`, {
      method: "DELETE",
    }),
}

// AI Diagnosis API
export const diagnosisApi = {
  analyze: (data: {
    symptoms: string[]
    duration: string
    severity: string
    additionalNotes?: string
  }) =>
    apiFetch("/api/diagnosis", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Doctors API
export const doctorsApi = {
  getAll: (params?: { specialization?: string; page?: string; limit?: string }) =>
    apiFetch("/api/doctors", { params }),
  getById: (id: string) => apiFetch(`/api/doctors/${id}`),
  getAvailability: (id: string, date: string) =>
    apiFetch(`/api/doctors/${id}/availability`, { params: { date } }),
}

// Patients API
export const patientsApi = {
  register: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    password: string
  }) =>
    apiFetch("/api/patients/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (email: string, password: string) =>
    apiFetch("/api/patients/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getProfile: () => apiFetch("/api/patients/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    apiFetch("/api/patients/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}

// Health Records API
export const healthRecordsApi = {
  getAll: (patientId: string) => apiFetch(`/api/health-records?patientId=${patientId}`),
  getById: (id: string) => apiFetch(`/api/health-records/${id}`),
  create: (data: {
    patientId: string
    type: string
    title: string
    description: string
    date: string
  }) =>
    apiFetch("/api/health-records", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
