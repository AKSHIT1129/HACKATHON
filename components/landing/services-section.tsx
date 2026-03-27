import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals managing personal health",
    price: "Free",
    period: "",
    features: [
      "AI Symptom Checker",
      "Basic Health Records",
      "Appointment Scheduling",
      "Email Support",
      "Mobile App Access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for families and health-conscious users",
    price: "$29",
    period: "/month",
    features: [
      "Everything in Basic",
      "Unlimited Telemedicine",
      "Family Member Profiles",
      "Priority Support",
      "Health Analytics Dashboard",
      "Prescription Management",
      "Lab Result Integration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For healthcare providers and organizations",
    price: "Custom",
    period: "",
    features: [
      "Everything in Professional",
      "White-label Solution",
      "API Access",
      "Dedicated Account Manager",
      "Custom Integrations",
      "Advanced Analytics",
      "SLA Guarantee",
      "On-premise Deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary">Pricing</h2>
          <p className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Plans that scale with your needs
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Choose the perfect plan for your healthcare journey. Start free and upgrade 
            as your needs grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.popular 
                  ? "border-primary shadow-lg ring-1 ring-primary" 
                  : "border shadow-sm"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
