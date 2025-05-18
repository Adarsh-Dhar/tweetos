"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bot, Plus, Settings, Play, Pause, Trash2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TwitterConfig } from "@/lib/twitter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BotData {
  id: string;
  name: string;
  description: string;
  triggers: {
    type: string;
    value: string;
  }[];
  actions: {
    type: string;
    config: Record<string, any>;
  }[];
  schedule: {
    enabled: boolean;
    frequency: string;
    time?: string;
  };
  status: "active" | "paused" | "error";
  lastRun?: string;
  nextRun?: string;
  stats: {
    tweetsPosted: number;
    interactions: number;
    followers: number;
  };
}

export default function BotsPage() {
  const router = useRouter()
  const [twitterConfig, setTwitterConfig] = useState<TwitterConfig | null>(null)
  const [bots, setBots] = useState<BotData[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Load Twitter config from localStorage
    const storedConfig = localStorage.getItem("twitterConfig")
    if (storedConfig) {
      try {
        setTwitterConfig(JSON.parse(storedConfig))
      } catch (e) {
        console.error("Failed to parse Twitter config", e)
      }
    }

    // Load bots from localStorage
    const storedBots = localStorage.getItem("twitterBots")
    if (storedBots) {
      try {
        setBots(JSON.parse(storedBots))
      } catch (e) {
        console.error("Failed to parse bots", e)
      }
    }
  }, [])

  const toggleBotStatus = (botId: string) => {
    const updatedBots = bots.map(bot => {
      if (bot.id === botId) {
        const newStatus = bot.status === "active" ? "paused" : "active"
        return { 
          ...bot, 
          status: newStatus,
          nextRun: newStatus === "active" ? getNextRunTime(bot.schedule) : undefined
        }
      }
      return bot
    })
    
    setBots(updatedBots)
    localStorage.setItem("twitterBots", JSON.stringify(updatedBots))
  }

  const deleteBot = (botId: string) => {
    const updatedBots = bots.filter(bot => bot.id !== botId)
    setBots(updatedBots)
    localStorage.setItem("twitterBots", JSON.stringify(updatedBots))
  }

  const getNextRunTime = (schedule: { enabled: boolean, frequency: string, time?: string }) => {
    if (!schedule.enabled) return undefined
    
    const now = new Date()
    const nextRun = new Date()
    
    if (schedule.time) {
      const [hours, minutes] = schedule.time.split(":").map(Number)
      nextRun.setHours(hours, minutes, 0, 0)
    }
    
    if (nextRun <= now) {
      // If the time has already passed today, schedule for tomorrow
      if (schedule.frequency === "daily") {
        nextRun.setDate(nextRun.getDate() + 1)
      } else if (schedule.frequency === "weekly") {
        nextRun.setDate(nextRun.getDate() + 7)
      } else if (schedule.frequency === "hourly") {
        nextRun.setHours(nextRun.getHours() + 1)
      }
    }
    
    return nextRun.toISOString()
  }

  const filteredBots = activeTab === "all" 
    ? bots 
    : bots.filter(bot => bot.status === activeTab)

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Your Twitter Bots</h1>
        </div>
        <Button onClick={() => router.push("/create-bot")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Bot
        </Button>
      </div>

      {!twitterConfig && (
        <Alert className="mb-8">
          <Settings className="h-4 w-4" />
          <AlertTitle>Twitter API not configured</AlertTitle>
          <AlertDescription>
            You need to configure your Twitter API credentials before creating bots.
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/twitter")}>
              Configure now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Bots</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredBots.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No bots found</h2>
              <p className="mt-2 text-muted-foreground">
                {activeTab === "all" 
                  ? "You haven't created any bots yet." 
                  : `You don't have any ${activeTab} bots.`}
              </p>
              <Button className="mt-6" onClick={() => router.push("/create-bot")}>
                Create Your First Bot
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBots.map(bot => (
                <Card key={bot.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={bot.status === "active" ? "default" : bot.status === "paused" ? "outline" : "destructive"}
                        className="mb-2"
                      >
                        {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                      </Badge>
                      <Switch 
                        checked={bot.status === "active"}
                        onCheckedChange={() => toggleBotStatus(bot.id)}
                      />
                    </div>
                    <CardTitle>{bot.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{bot.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trigger:</span>
                        <span className="font-medium">
                          {bot.triggers.length > 0 
                            ? bot.triggers[0].type === "hashtag" 
                              ? `#${bot.triggers[0].value}` 
                              : bot.triggers[0].type
                            : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actions:</span>
                        <span className="font-medium">{bot.actions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Schedule:</span>
                        <span className="font-medium">
                          {bot.schedule.enabled 
                            ? `${bot.schedule.frequency} ${bot.schedule.time ? `at ${bot.schedule.time}` : ''}`
                            : "Manual"}
                        </span>
                      </div>
                      {bot.lastRun && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last run:</span>
                          <span className="font-medium">
                            {new Date(bot.lastRun).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {bot.nextRun && bot.status === "active" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next run:</span>
                          <span className="font-medium">
                            {new Date(bot.nextRun).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/bot/${bot.id}`)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleBotStatus(bot.id)}
                      >
                        {bot.status === "active" ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteBot(bot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
