import { NextResponse } from "next/server"
import { symptomCheckerSchema } from "@/lib/validations"
import type { DiagnosisResult, PossibleCondition } from "@/lib/types"

// Sample condition database for demo
// In production, this would be connected to an AI service or medical database
const conditionDatabase: Record<string, PossibleCondition> = {
  "common-cold": {
    name: "Common Cold",
    probability: 0,
    description: "A viral infection of the upper respiratory tract.",
    commonSymptoms: ["runny nose", "sore throat", "cough", "congestion", "sneezing"],
  },
  "flu": {
    name: "Influenza (Flu)",
    probability: 0,
    description: "A contagious respiratory illness caused by influenza viruses.",
    commonSymptoms: ["fever", "body aches", "fatigue", "cough", "headache"],
  },
  "allergies": {
    name: "Allergic Rhinitis",
    probability: 0,
    description: "An allergic response causing sneezing, itching, and congestion.",
    commonSymptoms: ["sneezing", "itchy eyes", "runny nose", "congestion", "watery eyes"],
  },
  "migraine": {
    name: "Migraine",
    probability: 0,
    description: "A neurological condition causing intense, throbbing headaches.",
    commonSymptoms: ["severe headache", "nausea", "light sensitivity", "vision changes", "dizziness"],
  },
  "gastroenteritis": {
    name: "Gastroenteritis",
    probability: 0,
    description: "Inflammation of the stomach and intestines, usually due to infection.",
    commonSymptoms: ["nausea", "vomiting", "diarrhea", "stomach pain", "fever"],
  },
  "anxiety": {
    name: "Anxiety Disorder",
    probability: 0,
    description: "A mental health condition characterized by excessive worry and fear.",
    commonSymptoms: ["racing heart", "difficulty breathing", "sweating", "restlessness", "difficulty sleeping"],
  },
}

function analyzeSymptoms(
  symptoms: string[],
  severity: string
): { conditions: PossibleCondition[]; urgencyLevel: DiagnosisResult["urgencyLevel"] } {
  const symptomsLower = symptoms.map((s) => s.toLowerCase())
  const matchedConditions: PossibleCondition[] = []

  // Simple matching algorithm - in production, use ML/AI
  for (const [, condition] of Object.entries(conditionDatabase)) {
    const matchingSymptoms = condition.commonSymptoms.filter((cs) =>
      symptomsLower.some((s) => cs.includes(s) || s.includes(cs))
    )

    if (matchingSymptoms.length > 0) {
      const probability = Math.min(
        (matchingSymptoms.length / condition.commonSymptoms.length) * 100,
        95
      )
      
      matchedConditions.push({
        ...condition,
        probability: Math.round(probability),
      })
    }
  }

  // Sort by probability
  matchedConditions.sort((a, b) => b.probability - a.probability)

  // Determine urgency level
  let urgencyLevel: DiagnosisResult["urgencyLevel"] = "low"
  
  const emergencySymptoms = [
    "chest pain",
    "difficulty breathing",
    "severe bleeding",
    "loss of consciousness",
    "stroke symptoms",
    "severe allergic reaction",
  ]

  const highUrgencySymptoms = [
    "high fever",
    "severe pain",
    "persistent vomiting",
    "confusion",
    "severe headache",
  ]

  if (symptomsLower.some((s) => emergencySymptoms.some((e) => s.includes(e)))) {
    urgencyLevel = "emergency"
  } else if (severity === "severe" || symptomsLower.some((s) => highUrgencySymptoms.some((h) => s.includes(h)))) {
    urgencyLevel = "high"
  } else if (severity === "moderate") {
    urgencyLevel = "medium"
  }

  return {
    conditions: matchedConditions.slice(0, 5), // Top 5 matches
    urgencyLevel,
  }
}

function getRecommendedActions(
  urgencyLevel: DiagnosisResult["urgencyLevel"],
  conditions: PossibleCondition[]
): string[] {
  const actions: string[] = []

  switch (urgencyLevel) {
    case "emergency":
      actions.push("Seek immediate emergency medical care")
      actions.push("Call emergency services (911) if symptoms are life-threatening")
      break
    case "high":
      actions.push("Schedule an urgent appointment with a healthcare provider")
      actions.push("Consider visiting an urgent care facility")
      actions.push("Monitor symptoms closely for any worsening")
      break
    case "medium":
      actions.push("Schedule an appointment with your primary care physician")
      actions.push("Rest and stay hydrated")
      actions.push("Take over-the-counter medications as appropriate")
      break
    case "low":
      actions.push("Monitor symptoms over the next few days")
      actions.push("Rest and maintain good nutrition")
      actions.push("Consult a doctor if symptoms persist or worsen")
      break
  }

  if (conditions.length > 0) {
    actions.push("Keep a symptom diary to share with your healthcare provider")
  }

  return actions
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validationResult = symptomCheckerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { symptoms, duration, severity, additionalNotes } = validationResult.data

    // Analyze symptoms
    // TODO: Replace with actual AI/ML service integration
    const analysis = analyzeSymptoms(symptoms, severity)

    // Get recommended actions
    const recommendedActions = getRecommendedActions(
      analysis.urgencyLevel,
      analysis.conditions
    )

    // Create diagnosis result
    const result: DiagnosisResult = {
      id: crypto.randomUUID(),
      possibleConditions: analysis.conditions,
      recommendedActions,
      urgencyLevel: analysis.urgencyLevel,
      disclaimers: [
        "This is not a medical diagnosis and should not replace professional medical advice.",
        "Always consult with a qualified healthcare provider for proper diagnosis and treatment.",
        "If you are experiencing a medical emergency, please call emergency services immediately.",
        "The AI analysis is based on the symptoms you provided and may not be comprehensive.",
      ],
      createdAt: new Date().toISOString(),
    }

    // TODO: Store analysis for future reference
    // await storeAnalysis(result, { symptoms, duration, severity, additionalNotes })

    // TODO: Log for analytics (anonymized)
    console.log("Symptom Analysis:", {
      symptomCount: symptoms.length,
      duration,
      severity,
      urgencyLevel: result.urgencyLevel,
      conditionsFound: result.possibleConditions.length,
      hasAdditionalNotes: !!additionalNotes,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Diagnosis API Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to analyze symptoms" },
      { status: 500 }
    )
  }
}
