"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bot, ArrowLeft, Save, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwitterConfig } from "@/lib/twitter"
import BotCreator from "@/components/bot-creator"

export default function CreateBotPage() {
  const router = useRouter()
  const [twitterConfig, setTwitterConfig] = useState<TwitterConfig | null>(null)
  const [botName, setBotName] = useState("")
  const [botDescription, setBotDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  }, [])

  const handleSaveBot = (botConfig: any) => {
    if (!botName.trim()) {
      setError("Bot name is required")
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create a new bot object
      const newBot = {
        id: uuidv4(),
        name: botName,
        description: botDescription,
        triggers: botConfig.triggers || [],
        actions: botConfig.actions || [],
        schedule: botConfig.schedule || {
          enabled: false,
          frequency: "daily",
        },
        status: "paused" as const,
        stats: {
          tweetsPosted: 0,
          interactions: 0,
          followers: 0,
        },
        createdAt: new Date().toISOString(),
      }

      // Get existing bots or initialize empty array
      const existingBotsString = localStorage.getItem("twitterBots")
      const existingBots = existingBotsString ? JSON.parse(existingBotsString) : []
      
      // Add new bot
      const updatedBots = [...existingBots, newBot]
      
      // Save to localStorage
      localStorage.setItem("twitterBots", JSON.stringify(updatedBots))
      
      // Redirect to bots page
      router.push("/bots")
    } catch (e) {
      console.error("Failed to save bot", e)
      setError("Failed to save bot. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.push("/bots")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bots
        </Button>
        <h1 className="text-3xl font-bold">Create New Bot</h1>
      </div>

      {!twitterConfig ? (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Twitter API not configured</AlertTitle>
          <AlertDescription>
            You need to configure your Twitter API credentials before creating bots.
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/twitter")}>
              Configure now
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Bot Details</CardTitle>
              <CardDescription>
                Enter basic information about your Twitter bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input 
                  id="bot-name" 
                  placeholder="My Twitter Bot" 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bot-description">Description</Label>
                <Textarea 
                  id="bot-description" 
                  placeholder="What does your bot do?" 
                  value={botDescription}
                  onChange={(e) => setBotDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="visual" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="visual">Visual Builder</TabsTrigger>
              <TabsTrigger value="code">Code Editor</TabsTrigger>
            </TabsList>
            <TabsContent value="visual">
              <BotCreator 
                initialName={botName}
                initialDescription={botDescription}
                onSave={handleSaveBot}
                twitterConfig={twitterConfig}
              />
            </TabsContent>
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Code Editor</CardTitle>
                  <CardDescription>
                    Write custom code for your Twitter bot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    className="font-mono text-sm min-h-[400px]"
                    placeholder="// Write your custom Twitter bot code here
// Example:
const twitterClient = createTwitterClient(twitterConfig);

// Search for tweets with hashtag
const searchResults = await twitterClient.v2.search({
  query: '#javascript',
  max_results: 10,
});

// Like and retweet
for (const tweet of searchResults.data.data) {
  await twitterClient.v2.like(myUserId, tweet.id);
  await twitterClient.v2.retweet(myUserId, tweet.id);
}"
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Test Code</Button>
                  <Button onClick={() => handleSaveBot({})}>Save Bot</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button 
              disabled={saving || !botName.trim()} 
              onClick={() => handleSaveBot({})}
            >
              {saving ? "Saving..." : "Save Bot"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
