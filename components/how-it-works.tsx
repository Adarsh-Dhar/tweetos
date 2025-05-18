"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Accounts",
      description: "Link your Twitter account and Aptos wallet to get started.",
    },
    {
      number: "02",
      title: "Design Your Bot",
      description: "Use our visual builder to create your bot's logic and actions.",
    },
    {
      number: "03",
      title: "Set Triggers & Actions",
      description: "Define what tweets trigger your bot and what blockchain actions to execute.",
    },
    {
      number: "04",
      title: "Deploy & Monitor",
      description: "Launch your bot and track its performance in real-time.",
    },
  ]

  return (
    <section id="how-it-works" className="py-12 md:py-20 bg-muted/30 rounded-3xl">
      <div className="container">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create and deploy your custom Twitter bot in just four simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(50%-30px)] right-[calc(50%-30px)] h-0.5 bg-border z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-background rounded-xl p-6 border shadow-sm h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-16 -right-3 items-center justify-center z-20">
                  <div className="bg-background rounded-full p-1 border">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
