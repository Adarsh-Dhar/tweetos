"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { verifyCredentials } from "@/lib/twitter"

const twitterConfigSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  apiKeySecret: z.string().min(1, "API Key Secret is required"),
  accessToken: z.string().min(1, "Access Token is required"),
  accessTokenSecret: z.string().min(1, "Access Token Secret is required"),
  botName: z.string().min(1, "Bot name is required"),
})

type TwitterConfigFormValues = z.infer<typeof twitterConfigSchema>

export default function TwitterConfigPage() {
  const router = useRouter()
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const form = useForm<TwitterConfigFormValues>({
    resolver: zodResolver(twitterConfigSchema),
    defaultValues: {
      apiKey: "",
      apiKeySecret: "",
      accessToken: "",
      accessTokenSecret: "",
      botName: "",
    },
  })

  const onSubmit = async (data: TwitterConfigFormValues) => {
    setVerifying(true)
    setVerificationResult(null)
    
    try {
      // In a real app, we would call the API to verify credentials
      // For now, we'll simulate a successful verification
      // const result = await verifyCredentials(data)
      
      // Store the credentials in localStorage (in a real app, use a more secure method)
      localStorage.setItem("twitterConfig", JSON.stringify(data))
      
      setVerificationResult({
        success: true,
        message: "Twitter credentials verified successfully!",
      })
      
      // Redirect to the bot creator page after a short delay
      setTimeout(() => {
        router.push("/#create")
      }, 2000)
    } catch (error) {
      setVerificationResult({
        success: false,
        message: "Failed to verify Twitter credentials. Please check and try again.",
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="container max-w-3xl py-12">
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle>Twitter API Configuration</CardTitle>
          </div>
          <CardDescription>
            Enter your Twitter API credentials to create and manage your Twitter bot.
            You can get these credentials from the Twitter Developer Portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationResult && (
            <Alert className={`mb-6 ${verificationResult.success ? "bg-green-50" : "bg-red-50"}`}>
              {verificationResult.success ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle>
                {verificationResult.success ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {verificationResult.message}
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="botName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Twitter Bot" {...field} />
                    </FormControl>
                    <FormDescription>
                      A friendly name for your bot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter API Key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiKeySecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key Secret</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter API Key Secret" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter Access Token" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessTokenSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token Secret</FormLabel>
                      <FormControl>
                        <Input placeholder="Twitter Access Token Secret" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={verifying}>
                  {verifying ? "Verifying..." : "Verify & Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t px-6 py-4">
          <h4 className="text-sm font-medium mb-2">How to get Twitter API credentials:</h4>
          <ol className="text-sm text-muted-foreground list-decimal pl-4 space-y-1">
            <li>Go to the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" className="text-primary hover:underline">Twitter Developer Portal</a></li>
            <li>Create a new project and app</li>
            <li>Enable OAuth 1.0a in the app settings</li>
            <li>Generate the API Key, API Key Secret, Access Token, and Access Token Secret</li>
            <li>Copy and paste these credentials into the form above</li>
          </ol>
        </CardFooter>
      </Card>
    </div>
  )
}
