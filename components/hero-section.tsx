"use client"

import { motion } from "framer-motion"
import { ArrowRight, Bot, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="container relative">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="h-px w-8 bg-border" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Twitter className="h-6 w-6 text-blue-500" />
            </div>
            <div className="h-px w-8 bg-border" />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
              <svg
                className="h-6 w-6 text-purple-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10.5L12 15.5L17 10.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create <span className="text-primary">Twitter Bots</span> for <span className="text-purple-500">Aptos</span>{" "}
            in Minutes
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Build custom bots that execute blockchain actions via tweets. No coding required.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 rounded-lg border bg-card p-2 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <div className="rounded-md bg-muted p-4 h-[300px] md:h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-3xl bg-background rounded-lg shadow-lg p-6 border">
                <div className="flex items-center gap-3 mb-4">
                  <Twitter className="h-5 w-5 text-blue-500" />
                  <div className="h-2 w-24 bg-muted-foreground/20 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-muted-foreground/10 rounded-md animate-pulse" />
                  <div className="h-12 bg-muted-foreground/10 rounded-md animate-pulse" />
                  <div className="h-12 bg-muted-foreground/10 rounded-md animate-pulse" />
                </div>
                <div className="mt-6 flex justify-end">
                  <div className="h-10 w-32 bg-primary/80 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
