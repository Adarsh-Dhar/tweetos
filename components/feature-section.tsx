"use client"

import { motion } from "framer-motion"
import { Bot, Code, Coins, Cpu, Lock, Sparkles, Twitter, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureSectionProps {
  expanded?: boolean
}

export default function FeatureSection({ expanded = false }: FeatureSectionProps) {
  const features = [
    {
      icon: <Twitter className="h-6 w-6 text-blue-500" />,
      title: "Twitter Integration",
      description: "Seamlessly connect with Twitter's API to create bots that respond to tweets and mentions.",
    },
    {
      icon: <Bot className="h-6 w-6 text-primary" />,
      title: "No-Code Builder",
      description: "Drag-and-drop interface to build complex bot logic without writing a single line of code.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-purple-500" />,
      title: "Aptos Blockchain",
      description: "Execute trading, staking, and token creation directly on the Aptos blockchain.",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Instant Execution",
      description: "Trigger blockchain actions instantly when specific tweet conditions are met.",
    },
    {
      icon: <Lock className="h-6 w-6 text-green-500" />,
      title: "Secure Transactions",
      description: "Enterprise-grade security for all your blockchain transactions and wallet connections.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-pink-500" />,
      title: "Custom Triggers",
      description: "Set up custom triggers based on tweet content, hashtags, or user interactions.",
    },
    {
      icon: <Coins className="h-6 w-6 text-amber-500" />,
      title: "DeFi Integration",
      description: "Connect with Move Agent Kit's DeFi integrations for advanced financial operations.",
    },
    {
      icon: <Code className="h-6 w-6 text-slate-500" />,
      title: "Advanced Mode",
      description: "For developers: extend functionality with custom code and advanced configurations.",
    },
  ]

  const displayedFeatures = expanded ? features : features.slice(0, 4)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-12 md:py-20">
      <div className="container">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Powerful Features, <span className="text-primary">Simple Interface</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to create sophisticated blockchain-powered Twitter bots without writing code.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayedFeatures.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
