import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Stethoscope, 
  Calendar, 
  FileText, 
  Video, 
  Bell, 
  BarChart3,
  Lock,
  Zap
} from "lucide-react"

const features = [
  {
    icon: Stethoscope,
    title: "AI Symptom Analysis",
    description: "Advanced AI algorithms analyze symptoms in real-time, providing accurate preliminary diagnoses and treatment suggestions.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent appointment booking that optimizes doctor availability and reduces patient wait times significantly.",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    description: "Secure, centralized electronic health records accessible anytime, anywhere for both patients and providers.",
  },
  {
    icon: Video,
    title: "Telemedicine",
    description: "HD video consultations with healthcare professionals from the comfort of your home, with integrated vital monitoring.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automated medication reminders, appointment notifications, and personalized health tips delivered to your device.",
  },
  {
    icon: BarChart3,
    title: "Health Analytics",
    description: "Comprehensive health dashboards with trends, insights, and predictive analytics to track your wellness journey.",
  },
  {
    icon: Lock,
    title: "Data Security",
    description: "Enterprise-grade encryption and HIPAA-compliant infrastructure ensuring your health data remains private and protected.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get lab results, prescriptions, and medical reports delivered instantly through our secure digital platform.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary">Features</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for modern healthcare
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Our comprehensive platform combines cutting-edge AI technology with intuitive 
            design to deliver exceptional healthcare experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 bg-background shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
