import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: "MediCare AI - Intelligent Healthcare Solutions",
  description: "AI-powered healthcare platform providing intelligent diagnostics, personalized treatment recommendations, and seamless patient care management.",
  keywords: ["healthcare", "AI", "medical", "diagnostics", "patient care", "telemedicine"],
  authors: [{ name: "MediCare AI Team" }],
  openGraph: {
    title: "MediCare AI - Intelligent Healthcare Solutions",
    description: "AI-powered healthcare platform providing intelligent diagnostics and personalized treatment recommendations.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
