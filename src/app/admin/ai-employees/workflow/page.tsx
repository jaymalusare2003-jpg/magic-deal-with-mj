"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Brain, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

interface WorkflowStep {
  id: string
  name: string
  employee: string
  icon: string
  description: string
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "1", name: "AI Offer Researcher", employee: "AI Offer Researcher", icon: "🔍", description: "Analyzes CPA offers, identifies category, payout, conversion type, target countries" },
  { id: "2", name: "AI Compliance Employee", employee: "AI Compliance Employee", icon: "⚖️", description: "Checks traffic rules, compliance requirements, regulatory guidelines" },
  { id: "3", name: "AI Audience Researcher", employee: "AI Audience Researcher", icon: "🎯", description: "Identifies target audiences, search intent, audience segments" },
  { id: "4", name: "AI Traffic Researcher", employee: "AI Traffic Researcher", icon: "🚦", description: "Researches public traffic opportunities, SEO, communities" },
  { id: "5", name: "AI SEO Employee", employee: "AI SEO Employee", icon: "🔗", description: "Keyword research, SEO strategy, meta tags, content clusters" },
  { id: "6", name: "AI Content Employee", employee: "AI Content Employee", icon: "✍️", description: "Generates blog posts, SEO articles, social media, ad copy" },
  { id: "7", name: "AI Landing Page Employee", employee: "AI Landing Page Employee", icon: "🎨", description: "Generates landing pages with headlines, CTAs, trust sections" },
  { id: "8", name: "AI Campaign Employee", employee: "AI Campaign Employee", icon: "📊", description: "Develops campaign strategy, traffic strategy, tracking setup" },
  { id: "9", name: "AI Analytics Employee", employee: "AI Analytics Employee", icon: "📈", description: "Analyzes visitors, clicks, conversions, EPC, revenue" },
  { id: "10", name: "AI CRO Employee", employee: "AI CRO Employee", icon: "🧪", description: "Analyzes conversion rates, A/B testing, optimization recommendations" },
  { id: "11", name: "AI Manager", employee: "AI Manager", icon: "👨‍💼", description: "Consolidates all findings and produces final campaign report" },
]

interface WorkflowResult {
  status: "pending" | "running" | "completed" | "failed" | "skipped"
  result?: string
  startedAt?: string
  completedAt?: string
  error?: string
}

export default function WorkflowPage() {
  const [selectedOffer, setSelectedOffer] = useState<string>("")
  const [workflowResults, setWorkflowResults] = useState<Record<string, WorkflowResult>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [workflowLog, setWorkflowLog] = useState<string[]>([])
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null
    return createClient()
  }, [])

  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase client not available")
      const { data, error } = await supabase.from("offers").select("id, name, status")
      if (error) throw error
      return data
    },
  })

  const handleRunWorkflow = async () => {
    if (!selectedOffer) return

    setIsRunning(true)
    setWorkflowLog([])
    setWorkflowResults({})

    WORKFLOW_STEPS.forEach(key => {
      setWorkflowResults(prev => ({ ...prev, [key.id]: { status: "pending" } }))
    })

    for (const step of WORKFLOW_STEPS) {
      setWorkflowResults(prev => ({ ...prev, [step.id]: { status: "running", startedAt: new Date().toISOString() } }))
      setWorkflowLog(prev => [...prev, `Starting: ${step.name}`])

      try {
        const response = await fetch("/api/ai/workflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offerId: selectedOffer, step: step.id }),
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const result = await response.json()
        if (result.results?.[step.id]) {
          setWorkflowResults(prev => ({
            ...prev,
            [step.id]: {
              status: result.results[step.id].status || "completed",
              result: result.results[step.id].result,
              startedAt: result.results[step.id].startedAt,
              completedAt: result.results[step.id].completedAt,
            },
          }))
        } else {
          setWorkflowResults(prev => ({ ...prev, [step.id]: { status: "completed", result: "Step completed" } }))
        }

        setWorkflowLog(prev => [...prev, `Completed: ${step.name}`])
      } catch (error) {
        setWorkflowResults(prev => ({ ...prev, [step.id]: { status: "failed", error: String(error) } }))
        setWorkflowLog(prev => [...prev, `Failed: ${step.name} - ${error}`])
      }
    }

    setIsRunning(false)
    setWorkflowLog(prev => [...prev, "Workflow completed!"])
  }

  const resetWorkflow = () => {
    setWorkflowResults({})
    setWorkflowLog([])
    setSelectedOffer("")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Campaign Workflow</h1>
          <p className="text-sm text-muted-foreground">Run the full AI campaign automation chain</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={resetWorkflow} disabled={isRunning}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleRunWorkflow} disabled={isRunning || !selectedOffer}>
            <Brain className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Run Workflow"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Select Offer</Label>
        <Select value={selectedOffer} onValueChange={setSelectedOffer} disabled={isRunning}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an offer to start the workflow..." />
          </SelectTrigger>
          <SelectContent>
            {(offers || []).map((offer: any) => (
              <SelectItem key={offer.id} value={offer.id}>
                {offer.name} ({offer.status})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {WORKFLOW_STEPS.map((step, index) => {
            const result = workflowResults[step.id]
            const status = result?.status || "idle"
            const statusColors = {
              idle: "border-muted bg-muted/30",
              pending: "border-yellow-200 bg-yellow-50",
              running: "border-blue-200 bg-blue-50",
              completed: "border-green-200 bg-green-50",
              failed: "border-red-200 bg-red-50",
              skipped: "border-gray-200 bg-gray-50",
            }

            return (
              <Card key={step.id} className={`border-2 transition-all ${statusColors[status]}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <span>{step.name}</span>
                        <span className="text-sm font-normal text-muted-foreground block">
                          {step.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {index > 0 && <div className="w-8 h-px bg-border" />}
                      {status === "completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {status === "running" && <Clock className="h-5 w-5 text-blue-600 animate-spin" />}
                      {status === "failed" && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {status === "pending" && <Clock className="h-5 w-5 text-yellow-600" />}
                    </div>
                  </CardTitle>
                </CardHeader>
                {result?.result && (
                  <CardContent>
                    <div className="bg-background border rounded-lg p-4 max-h-60 overflow-y-auto">
                      <pre className="text-xs whitespace-pre-wrap">{result.result.substring(0, 500)}...</pre>
                    </div>
                  </CardContent>
                )}
                {result?.error && (
                  <CardContent>
                    <div className="text-sm text-destructive">{result.error}</div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto">
                {workflowLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No workflow activity yet.</p>
                ) : (
                  <div className="space-y-2 text-sm">
                    {workflowLog.map((log, i) => (
                      <div key={i} className="py-1 border-b last:border-0">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {WORKFLOW_STEPS.map(step => {
                  const result = workflowResults[step.id]
                  const status = result?.status || "idle"
                  const statusText = {
                    idle: "Not Started",
                    pending: "Pending",
                    running: "Running",
                    completed: "Completed",
                    failed: "Failed",
                    skipped: "Skipped",
                  }[status]
                  return (
                    <div key={step.id} className="flex justify-between">
                      <span>{step.name}</span>
                      <span className={status === "completed" ? "text-green-600" : status === "failed" ? "text-red-600" : "text-muted-foreground"}>
                        {statusText}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
