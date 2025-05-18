"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bot, ChevronDown, Code, Coins, Plus, Save, Settings, Twitter, AlertCircle, RefreshCw, MessageSquare, Bell, Clock, User, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TwitterConfig } from "@/lib/twitter"

interface BotConfig {
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
}

export default function BotCreator() {
  const router = useRouter()
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [droppedItems, setDroppedItems] = useState<string[]>([])
  const [twitterConfig, setTwitterConfig] = useState<TwitterConfig | null>(null)
  const [botConfig, setBotConfig] = useState<BotConfig>({
    name: "",
    description: "",
    triggers: [],
    actions: [],
    schedule: {
      enabled: false,
      frequency: "daily",
    },
  })
  const [configTab, setConfigTab] = useState("basic")
  const [showConfigWarning, setShowConfigWarning] = useState(false)

  // Load Twitter config from localStorage on component mount
  useEffect(() => {
    const storedConfig = localStorage.getItem("twitterConfig")
    if (storedConfig) {
      try {
        setTwitterConfig(JSON.parse(storedConfig))
        setShowConfigWarning(false)
      } catch (e) {
        console.error("Failed to parse Twitter config", e)
        setShowConfigWarning(true)
      }
    } else {
      setShowConfigWarning(true)
    }
  }, [])

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDrop = () => {
    if (draggedItem && !droppedItems.includes(draggedItem)) {
      setDroppedItems([...droppedItems, draggedItem])
      
      // Add to bot config actions
      if (draggedItem === "tweet-trigger") {
        setBotConfig(prev => ({
          ...prev,
          triggers: [...prev.triggers, { type: "hashtag", value: "" }]
        }))
      } else {
        setBotConfig(prev => ({
          ...prev,
          actions: [...prev.actions, { type: draggedItem, config: {} }]
        }))
      }
    }
    setDraggedItem(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeItem = (index: number) => {
    const newItems = [...droppedItems]
    newItems.splice(index, 1)
    setDroppedItems(newItems)
    
    // Remove from bot config
    if (droppedItems[index] === "tweet-trigger") {
      setBotConfig(prev => ({
        ...prev,
        triggers: prev.triggers.filter((_, i) => i !== index)
      }))
    } else {
      setBotConfig(prev => ({
        ...prev,
        actions: prev.actions.filter((_, i) => i !== index)
      }))
    }
  }
  
  const handleBotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotConfig(prev => ({ ...prev, name: e.target.value }))
  }
  
  const handleBotDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBotConfig(prev => ({ ...prev, description: e.target.value }))
  }
  
  const handleTriggerChange = (index: number, field: string, value: string) => {
    setBotConfig(prev => {
      const newTriggers = [...prev.triggers]
      newTriggers[index] = { ...newTriggers[index], [field]: value }
      return { ...prev, triggers: newTriggers }
    })
  }
  
  const handleScheduleChange = (field: string, value: any) => {
    setBotConfig(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [field]: value }
    }))
  }

  const actionBlocks = [
    { id: "tweet-trigger", name: "Tweet Trigger", icon: <Twitter className="h-4 w-4 text-blue-500" />, description: "Monitor tweets with specific hashtags or mentions" },
    { id: "post-tweet", name: "Post Tweet", icon: <MessageSquare className="h-4 w-4 text-blue-500" />, description: "Post a new tweet" },
    { id: "like-tweet", name: "Like Tweet", icon: <Bell className="h-4 w-4 text-pink-500" />, description: "Like tweets that match criteria" },
    { id: "retweet", name: "Retweet", icon: <RefreshCw className="h-4 w-4 text-green-500" />, description: "Retweet tweets that match criteria" },
    { id: "follow-user", name: "Follow User", icon: <User className="h-4 w-4 text-indigo-500" />, description: "Follow users based on criteria" },
    { id: "scheduled-tweet", name: "Scheduled Tweet", icon: <Clock className="h-4 w-4 text-orange-500" />, description: "Schedule tweets to be posted at specific times" },
    { id: "custom-code", name: "Custom Code", icon: <Code className="h-4 w-4 text-slate-500" />, description: "Add custom code for advanced functionality" },
  ]

  return (
    <section id="create" className="py-12">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Create Your <span className="text-primary">Twitter Bot</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Drag and drop components to build your custom Twitter bot with automated actions.
          </p>
        </motion.div>
        
        {showConfigWarning && (
          <Alert className="mb-8 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Twitter API Configuration Required</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>You need to configure your Twitter API credentials before creating a bot.</span>
              <Button size="sm" onClick={() => router.push('/twitter-config')}>
                Configure Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                  <CardDescription>Configure your bot details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bot-name">Bot Name</Label>
                      <Input 
                        id="bot-name" 
                        placeholder="My Twitter Bot" 
                        value={botConfig.name}
                        onChange={handleBotNameChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bot-description">Description</Label>
                      <Textarea 
                        id="bot-description" 
                        placeholder="What does your bot do?" 
                        className="resize-none" 
                        rows={3}
                        value={botConfig.description}
                        onChange={handleBotDescriptionChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="schedule-enabled">Schedule Bot</Label>
                        <Switch 
                          id="schedule-enabled" 
                          checked={botConfig.schedule.enabled}
                          onCheckedChange={(checked) => handleScheduleChange('enabled', checked)}
                        />
                      </div>
                      {botConfig.schedule.enabled && (
                        <div className="grid gap-2 mt-2">
                          <Label htmlFor="schedule-frequency">Frequency</Label>
                          <Select 
                            value={botConfig.schedule.frequency}
                            onValueChange={(value) => handleScheduleChange('frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Action Blocks</CardTitle>
                  <CardDescription>Drag these blocks to your workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {actionBlocks.map((block) => (
                      <TooltipProvider key={block.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              draggable
                              onDragStart={() => handleDragStart(block.id)}
                              className="flex items-center gap-2 p-3 bg-muted rounded-md cursor-move hover:bg-muted/80 transition-colors"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border">
                                {block.icon}
                              </div>
                              <span>{block.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{block.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-9">
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bot Workflow</CardTitle>
                    <CardDescription>Drop action blocks here to build your workflow</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Link2 className="h-4 w-4" /> Connect Account
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Save className="h-4 w-4" /> Save Bot
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="min-h-[400px] border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {droppedItems.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Drag and drop action blocks here to build your bot workflow</p>
                      <p className="text-sm mt-2">Start by adding a trigger like <Badge variant="outline" className="font-normal">Tweet Trigger</Badge></p>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      {droppedItems.map((item, index) => {
                        const block = actionBlocks.find((b) => b.id === item)
                        return (
                          <div key={index} className="relative">
                            <Card>
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                      {block?.icon}
                                    </div>
                                    <span className="font-medium">{block?.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              {item === "tweet-trigger" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="trigger-type">Trigger Type</Label>
                                      <Select 
                                        value={botConfig.triggers[index]?.type || "hashtag"}
                                        onValueChange={(value) => handleTriggerChange(index, "type", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select trigger type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="hashtag">Hashtag</SelectItem>
                                          <SelectItem value="mention">Mention</SelectItem>
                                          <SelectItem value="keyword">Keyword</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor={`value-${index}`}>
                                        {botConfig.triggers[index]?.type === "hashtag" ? "Hashtag" : 
                                         botConfig.triggers[index]?.type === "mention" ? "Username" : "Keyword"}
                                      </Label>
                                      <Input 
                                        id={`value-${index}`} 
                                        placeholder={botConfig.triggers[index]?.type === "hashtag" ? "#TwitterBot" : 
                                                    botConfig.triggers[index]?.type === "mention" ? "@username" : "keyword"} 
                                        value={botConfig.triggers[index]?.value || ""}
                                        onChange={(e) => handleTriggerChange(index, "value", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                              {item === "post-tweet" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="tweet-content">Tweet Content</Label>
                                      <Textarea 
                                        id="tweet-content" 
                                        placeholder="What would you like to tweet?" 
                                        className="resize-none" 
                                        rows={3} 
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="flex items-center justify-between">
                                        <Label htmlFor="include-media">Include Media</Label>
                                        <Switch id="include-media" />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                              {item === "like-tweet" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="like-criteria">Like tweets that contain</Label>
                                      <Input id="like-criteria" placeholder="#hashtag or keyword" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="like-limit">Maximum likes per day</Label>
                                      <Input id="like-limit" type="number" placeholder="50" />
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                              {item === "follow-user" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="follow-criteria">Follow users who</Label>
                                      <Select defaultValue="tweet">
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select criteria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="tweet">Tweet with hashtag</SelectItem>
                                          <SelectItem value="mention">Mention your account</SelectItem>
                                          <SelectItem value="follow">Follow your account</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="follow-value">Hashtag or keyword</Label>
                                      <Input id="follow-value" placeholder="#TwitterBot" />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="follow-limit">Maximum follows per day</Label>
                                      <Input id="follow-limit" type="number" placeholder="30" />
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                              {item === "scheduled-tweet" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="scheduled-content">Tweet Content</Label>
                                      <Textarea 
                                        id="scheduled-content" 
                                        placeholder="What would you like to tweet?" 
                                        className="resize-none" 
                                        rows={3} 
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="schedule-frequency">Frequency</Label>
                                        <Select defaultValue="daily">
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="schedule-time">Time</Label>
                                        <Input id="schedule-time" type="time" defaultValue="09:00" />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                              {item === "custom-code" && (
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="custom-code">Custom JavaScript Code</Label>
                                      <Textarea 
                                        id="custom-code" 
                                        placeholder="// Write your custom Twitter bot logic here" 
                                        className="font-mono text-sm" 
                                        rows={6} 
                                      />
                                    </div>
                                    <Alert className="bg-amber-50 border-amber-200">
                                      <AlertCircle className="h-4 w-4 text-amber-600" />
                                      <AlertTitle>Advanced Feature</AlertTitle>
                                      <AlertDescription>
                                        Custom code will run in a secure sandbox environment.
                                      </AlertDescription>
                                    </Alert>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                            {index < droppedItems.length - 1 && (
                              <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 z-10">
                                <div className="h-8 w-0.5 bg-border" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                      <Button variant="outline" className="w-full gap-2">
                        <Plus className="h-4 w-4" /> Add Action
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline">Test Bot</Button>
                  <Button variant="outline">Save as Template</Button>
                </div>
                <Button disabled={droppedItems.length === 0 || !twitterConfig}>Deploy Bot</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
