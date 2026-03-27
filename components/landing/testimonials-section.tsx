import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Cardiologist, NYC Health Center",
    content: "MediCare AI has transformed how I manage patient consultations. The AI-assisted diagnostics save me hours each week while improving accuracy.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Patient",
    content: "The telemedicine feature is incredible. I can consult with specialists without leaving home, and the AI symptom checker gives me peace of mind between appointments.",
    rating: 5,
  },
  {
    name: "Dr. Emily Chen",
    role: "Family Physician",
    content: "The integration with our existing systems was seamless. My staff loves the smart scheduling, and patients appreciate the automated reminders.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Hospital Administrator",
    content: "We have seen a 40% reduction in administrative overhead since implementing MediCare AI. The ROI has been exceptional.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Patient",
    content: "Managing my family&apos;s health records has never been easier. Everything is in one place, secure, and accessible whenever we need it.",
    rating: 5,
  },
  {
    name: "Dr. Robert Kim",
    role: "Pediatrician",
    content: "The AI recommendations are remarkably accurate. It&apos;s like having a brilliant colleague available 24/7 to discuss complex cases.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary">Testimonials</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by healthcare professionals worldwide
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what doctors, administrators, and patients are saying about their 
            experience with MediCare AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-background shadow-sm">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
                
                {/* Content */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
