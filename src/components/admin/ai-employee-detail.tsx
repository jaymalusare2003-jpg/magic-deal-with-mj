"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, History, Activity, Copy, AlertCircle, FileText, RefreshCw, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getTasksForRole } from "@/lib/constants/ai-employee-tasks"

interface ActivityEntry {
  timestamp: string
  type: string
  message: string
}

interface TaskEntry {
  timestamp: string
  prompt: string
}

interface OutputEntry {
  timestamp: string
  output: string
}

interface AiEmployeeDetailProps {
  employee: {
    id: string
    name: string
    icon: string | null
    role: string
    description: string | null
    system_instructions: string
    editable_prompt: string
    ai_model: string
    model_config: any
    enabled: boolean
    task_history: TaskEntry[] | null
    output_history: OutputEntry[] | null
    activity_logs: ActivityEntry[] | null
  }
}

export function AiEmployeeDetail({ employee }: AiEmployeeDetailProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [name, setName] = useState(employee.name)
  const [icon, setIcon] = useState(employee.icon || "")
  const [description, setDescription] = useState(employee.description || "")
  const [ai_model, setAiModel] = useState(employee.ai_model)
  const [systemInstructions, setSystemInstructions] = useState(employee.system_instructions)
  const [editablePrompt, setEditablePrompt] = useState(employee.editable_prompt)
  const [modelConfig, setModelConfig] = useState(
    employee.model_config ? JSON.stringify(employee.model_config, null, 2) : JSON.stringify({ temperature: 0.7, max_tokens: 4000 }, null, 2)
  )
  const [isEnabled, setIsEnabled] = useState(employee.enabled)

  const taskOptions = useMemo(() => getTasksForRole(employee.role), [employee.role])

  const [selectedTask, setSelectedTask] = useState<string>("")
  const [customPrompt, setCustomPrompt] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [taskError, setTaskError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [offers, setOffers] = useState<Array<{ id: string; name: string }>>([])
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("US")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedOffer, setSelectedOffer] = useState<string>("")
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [extraContext, setExtraContext] = useState("")
  const [taskInput, setTaskInput] = useState("")

  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null
    return createClient()
  }, [])

  useEffect(() => {
    if (!supabase) return
    const fetchSelectData = async () => {
      const { data: countryData } = await (supabase as any).from("countries").select("code, name")
      const { data: categoryData } = await (supabase as any).from("categories").select("id, name")
      const { data: offerData } = await (supabase as any).from("offers").select("id, name")
      const { data: campaignData } = await (supabase as any).from("campaigns").select("id, name")
      setCountries(countryData || [])
      setCategories(categoryData || [])
      setOffers(offerData || [])
      setCampaigns(campaignData || [])
    }
    fetchSelectData()
  }, [supabase])

  useEffect(() => {
    if (selectedTask) {
      const taskLabel = taskOptions.find(t => t.value === selectedTask)?.label || selectedTask
      setCustomPrompt(`${employee.editable_prompt}\n\nTask: ${taskLabel}`)
      setTaskInput("")
      setExtraContext("")
      setSelectedCountry("US")
      setSelectedCategory("")
      setSelectedOffer("")
      setSelectedCampaign("")
      setResult(null)
      setTaskError(null)
    }
  }, [selectedTask, employee.editable_prompt, taskOptions])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const updates: Record<string, any> = {
        name,
        icon: icon || null,
        description: description || null,
        ai_model,
        system_instructions: systemInstructions,
        editable_prompt: editablePrompt,
        enabled: isEnabled,
        model_config: modelConfig ? JSON.parse(modelConfig) : null,
      }

      const response = await fetch(`/api/ai/run-employee?employeeId=${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save employee")
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save employee")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRunTask = async () => {
    if (!selectedTask) return

    setIsRunning(true)
    setTaskError(null)
    setResult(null)

    try {
      const fullPrompt = taskInput || customPrompt

      const response = await fetch("/api/ai/run-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          prompt: fullPrompt,
          context: {
            task: selectedTask,
            country: selectedCountry,
            category: selectedCategory,
            offerId: selectedOffer,
            campaignId: selectedCampaign,
            extraContext: extraContext || undefined,
          },
        }),
      })

      const data = await response.json()

      if (data.error) {
        setTaskError(data.error)
      } else if (data.result) {
        setResult(data.result)
      } else {
        setTaskError("No response received from AI")
      }
    } catch (err) {
      setTaskError(err instanceof Error ? err.message : "Failed to execute AI task")
    } finally {
      setIsRunning(false)
    }
  }

  const needsCountry = ["country-audience", "country-seo", "country-copy", "traffic-strategy"].includes(selectedTask)
  const needsCategory = ["analyze-traffic", "traffic-strategy", "content-cluster"].includes(selectedTask)
  const needsOffer = ["analyze-offer", "campaign-strategy", "traffic-strategy"].includes(selectedTask)
  const needsCampaign = ["campaign-planning", "campaign-strategy", "tracking-plan"].includes(selectedTask)
  const needsExtraContext = ["analyze-offer"].includes(selectedTask)

  function renderAIResponse(text: string) {
    return text.split("\n").map((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) return <br key={i} />
      if (trimmed.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{trimmed.slice(4)}</h3>
      if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold mt-6 mb-2">{trimmed.slice(3)}</h2>
      if (trimmed.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mt-6 mb-2">{trimmed.slice(2)}</h1>
      if (trimmed.startsWith("- ")) return <li key={i} className="ml-4">{trimmed.slice(2)}</li>
      if (/^\d+\. /.test(trimmed)) return <li key={i} className="ml-4 list-decimal list-inside">{trimmed}</li>
      if (trimmed.startsWith("```")) return <code key={i} className="block bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">{trimmed.slice(3)}</code>
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) return <strong key={i} className="font-bold">{trimmed.slice(2, -2)}</strong>
      return <p key={i}>{line}</p>
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/ai-employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{employee.icon || "🤖"}</span>
          <h1 className="text-2xl font-bold">{employee.name}</h1>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
          Employee configuration saved successfully.
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">
          {saveError}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3 flex items-start gap-4">
                <span className="text-4xl">{employee.icon || "🤖"}</span>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{employee.role}</code></p>
                  <p className="text-sm text-muted-foreground">AI Model: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{employee.ai_model}</code></p>
                  <p className="text-sm text-muted-foreground">Status: <span className={employee.enabled ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{employee.enabled ? "Enabled" : "Disabled"}</span></p>
                </div>
              </div>

              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Icon</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. 🔍" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={employee.role} readOnly className="bg-gray-100" />
                <p className="text-xs text-muted-foreground mt-1">Role is fixed — determines available tasks.</p>
              </div>

              <div>
                <Label>AI Model</Label>
                <select value={ai_model} onChange={(e) => setAiModel(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
                <Label htmlFor="enabled">Enabled</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>System Instructions (System Prompt)</Label>
              <Textarea
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Core instructions that define how this AI employee behaves. These are loaded on every task execution.
              </p>
            </div>

            <div>
              <Label>Editable Prompt (Task Prompt)</Label>
              <Textarea
                value={editablePrompt}
                onChange={(e) => setEditablePrompt(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default prompt used for this employee's tasks. Edit this to customize behavior.
              </p>
            </div>

            <div>
              <Label>Model Config (JSON)</Label>
              <Textarea
                value={modelConfig}
                onChange={(e) => setModelConfig(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                JSON configuration: temperature, max_tokens, top_p, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/admin/ai-employees">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-3xl">{employee.icon || "🤖"}</span>
            {employee.name} — Run Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Task</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask} disabled={isRunning}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a task to run..." />
              </SelectTrigger>
              <SelectContent>
                {taskOptions.map((task: any) => (
                  <SelectItem key={task.value} value={task.value}>
                    <div>
                      <div className="font-medium">{task.label}</div>
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTask && (
            <>
              <div>
                <Label>Task Input</Label>
                <Textarea
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder={taskOptions.find(t => t.value === selectedTask)?.label || "Enter your task input..."}
                  rows={4}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Enter specific instructions for this task. Leave empty to use the employee's default prompt.
                </p>
              </div>

              {needsCountry && (
                <div>
                  <Label>Country</Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsCategory && (
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsOffer && (
                <div>
                  <Label>Offer</Label>
                  <Select value={selectedOffer} onValueChange={setSelectedOffer} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select offer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {offers.map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsCampaign && (
                <div>
                  <Label>Campaign</Label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign} disabled={isRunning}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign..." />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsExtraContext && (
                <div>
                  <Label>Additional Context (optional)</Label>
                  <Textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    placeholder="Enter any additional context for this task..."
                    rows={3}
                    disabled={isRunning}
                  />
                </div>
              )}

              <div>
                <Label>Custom Prompt</Label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  disabled={isRunning}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Combined with the employee's system instructions. Edit to customize behavior.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => {
                  setSelectedTask("")
                  setTaskInput("")
                  setExtraContext("")
                  setResult(null)
                  setTaskError(null)
                }} disabled={isRunning}>
                  Cancel
                </Button>
                <Button onClick={handleRunTask} disabled={isRunning || !customPrompt.trim()}>
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      AI Employee is working...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Run Task
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {!employee.enabled && !selectedTask && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm mt-4">
              This AI Employee is currently <strong>disabled</strong>. Enable it in the Configuration section above to run tasks.
            </div>
          )}
        </CardContent>
      </Card>

      {taskError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{taskError}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                AI Response
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(result)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const blob = new Blob([result], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `${employee.name.replace(/\s+/g, "-")}-${Date.now()}.txt`
                  a.click()
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {renderAIResponse(result)}
            </div>
          </CardContent>
        </Card>
      )}

      {(employee.output_history || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Output History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(employee.output_history || []).slice().reverse().map((entry: OutputEntry, i: number) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(entry.output || "")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto max-h-40">
                    {entry.output?.substring(0, 500)}{entry.output && entry.output.length > 500 && "..."}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(employee.task_history || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Task History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {(employee.task_history || []).slice().reverse().map((task: TaskEntry, i: number) => (
                <div key={i} className="text-sm border-b pb-2">
                  <div className="font-medium text-xs text-muted-foreground">{task.timestamp}</div>
                  <div className="text-sm mt-1">{task.prompt?.substring(0, 200)}{task.prompt && task.prompt.length > 200 && "..."}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(employee.activity_logs || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(employee.activity_logs || []).slice().reverse().map((log: ActivityEntry, i: number) => (
                <div key={i} className="text-sm flex justify-between">
                  <div>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      log.type === "task_completed" ? "bg-green-500" :
                      log.type === "task_started" ? "bg-blue-500" :
                      log.type === "task_error" ? "bg-red-500" :
                      "bg-gray-500"
                    }`}></span>
                    {log.message}
                  </div>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
