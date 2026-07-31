import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Send, History } from "lucide-react"
import Link from "next/link"
import { AI_EMPLOYEES } from "@/lib/constants/navigation"

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

export default async function AiEmployeeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: employee, error } = await supabase
    .from("ai_employees")
    .select("*")
    .eq("id", id)
    .single() as any

  if (!employee) {
    return <div className="p-6">AI Employee not found</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/ai-employees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit AI Employee</h1>
      </div>

      <form action={saveEmployee} method="post" className="space-y-6">
        <input type="hidden" name="id" value={employee.id} />

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input name="name" defaultValue={employee.name} />
            </div>
            <div>
              <Label>Icon</Label>
              <Input name="icon" defaultValue={employee.icon || ""} placeholder="e.g. 🔍" />
            </div>
            <div>
              <Label>Role</Label>
              <Input name="role" defaultValue={employee.role} />
            </div>
            <div>
              <Label>AI Model</Label>
              <select name="ai_model" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea name="description" defaultValue={employee.description || ""} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="enabled" name="enabled" defaultChecked={employee.enabled} />
              <Label htmlFor="enabled">Enabled</Label>
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
                name="system_instructions"
                defaultValue={employee.system_instructions}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Core instructions that define how this AI employee behaves.
              </p>
            </div>

            <div>
              <Label>Editable Prompt (Customizable)</Label>
              <Textarea
                name="editable_prompt"
                defaultValue={employee.editable_prompt}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                The prompt used for this employee's tasks. Edit this to customize behavior.
              </p>
            </div>

            <div>
              <Label>Model Config (JSON)</Label>
              <Textarea
                name="model_config"
                defaultValue={employee.model_config ? JSON.stringify(employee.model_config, null, 2) : JSON.stringify({ temperature: 0.7, max_tokens: 4000 }, null, 2)}
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                JSON configuration: temperature, max_tokens, top_p, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {employee.task_history && employee.task_history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Task History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {(employee.task_history || []).slice(-10).reverse().map((task: TaskEntry, i: number) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{task.timestamp}</div>
                    <div className="text-muted-foreground">{task.prompt?.substring(0, 200)}...</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {employee.activity_logs && employee.activity_logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(employee.activity_logs || []).slice(-10).reverse().map((log: ActivityEntry, i: number) => (
                  <div key={i} className="text-sm flex justify-between">
                    <span>{log.message}</span>
                    <span className="text-muted-foreground">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/admin/ai-employees">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

async function saveEmployee(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const id = formData.get("id") as string
  const updates: Record<string, any> = {}

  const fields = ["name", "icon", "role", "description", "system_instructions", "editable_prompt", "ai_model"]
  fields.forEach(f => { updates[f] = formData.get(f) })

  updates.enabled = formData.get("enabled") ? formData.get("enabled") === "on" || true : false
  updates.model_config = formData.get("model_config") ? JSON.parse(formData.get("model_config") as string) : null

   await (supabase as any).from("ai_employees").update(updates).eq("id", id)
}
