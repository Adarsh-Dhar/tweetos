"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import HowItWorks from "@/components/how-it-works"
import BotCreator from "@/components/bot-creator"
import PricingSection from "@/components/pricing-section"
import Footer from "@/components/footer"

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MoveBot</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#create" className="text-sm font-medium hover:text-primary">
              Create
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Log In
            </Button>
            <Button size="sm">Sign Up</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />

        <div className="container py-8 md:py-12">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="create">Create Bot</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-24">
              <FeatureSection />
              <HowItWorks />
              <PricingSection />
            </TabsContent>

            <TabsContent value="features">
              <FeatureSection expanded={true} />
            </TabsContent>

            <TabsContent value="create">
              <BotCreator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
