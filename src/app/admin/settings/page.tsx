import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { StatCard } from "@/components/shared/stat-card"
import { Save, Download, Trash2, Shield } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user: userObj } } = await supabase.auth.getUser()
  const { data: profile } = await (supabase as any).from("profiles").select("*").eq("user_id", userObj?.id).single()
  const { data: appSettings } = await supabase.from("app_settings").select("*") as any
  const { data: auditLogs } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50) as any

  const settingsMap = (appSettings || []).reduce((map: Record<string, any>, s: any) => {
    map[s.key] = s.value
    return map
  }, {})

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-sm text-muted-foreground">Application configuration and admin controls</p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard title="Total Settings" value={appSettings?.length || 0} icon={Shield} />
        <StatCard title="Audit Logs" value={auditLogs?.length || 0} icon={Shield} />
      </div>

      <form action={saveSettings} method="post" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input name="full_name" defaultValue={profile?.full_name || ""} />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input name="email" type="email" defaultValue={profile?.email || userObj?.email || ""} />
            </div>
            <div>
              <Label>Avatar URL</Label>
              <Input name="avatar_url" defaultValue={profile?.avatar_url || ""} />
            </div>
            <div>
              <Label>New Password</Label>
              <Input name="new_password" type="password" placeholder="Leave blank to keep current" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Master Automation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>AUTO UPDATE</Label>
                <p className="text-xs text-muted-foreground">Automatically sync offers from CPA networks</p>
              </div>
              <Switch name="auto_update" defaultChecked={settingsMap.auto_update !== false} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>AUTO ROUTING</Label>
                <p className="text-xs text-muted-foreground">Automatically route traffic by country to best offers</p>
              </div>
              <Switch name="auto_routing" defaultChecked={settingsMap.auto_routing !== false} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>AUTO OFFER REPLACEMENT</Label>
                <p className="text-xs text-muted-foreground">Automatically replace expired or paused offers</p>
              </div>
              <Switch name="auto_offer_replacement" defaultChecked={settingsMap.auto_offer_replacement === true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>AUTO OPTIMIZATION</Label>
                <p className="text-xs text-muted-foreground">Automatically optimize campaigns based on AI analysis</p>
              </div>
              <Switch name="auto_optimization" defaultChecked={settingsMap.auto_optimization === true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>AI RECOMMENDATIONS</Label>
                <p className="text-xs text-muted-foreground">Enable AI-powered recommendations and insights</p>
              </div>
              <Switch name="ai_recommendations" defaultChecked={settingsMap.ai_recommendations !== false} />
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Approval Required:</strong> Admin approval is required before changing live affiliate links,
                live offers, campaign budgets, or major campaign settings unless automatic rules are explicitly enabled.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme & Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Theme</Label>
              <select name="theme" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="system">System (Auto)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <input type="color" name="primary_color" defaultValue="#2563eb" className="w-10 h-8 p-0 border rounded" />
                <Input name="primary_color_hex" placeholder="#2563eb" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys & Secrets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label>OpenAI API Key</Label>
                <Input type="password" placeholder="••••••••••••••••" disabled />
                <p className="text-xs text-muted-foreground mt-1">Configured via OPENAI_API_KEY environment variable</p>
              </div>
              <div>
                <Label>Supabase Service Role Key</Label>
                <Input type="password" placeholder="••••••••••••••••" disabled />
                <p className="text-xs text-muted-foreground mt-1">Configured via SUPABASE_SERVICE_ROLE_KEY environment variable</p>
              </div>
              <div>
                <Label>CPA Network API Credentials</Label>
                <p className="text-xs text-muted-foreground">Stored securely server-side, never exposed to frontend</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2 font-medium">Timestamp</th>
                    <th className="text-left px-3 py-2 font-medium">User</th>
                    <th className="text-left px-3 py-2 font-medium">Action</th>
                    <th className="text-left px-3 py-2 font-medium">Table</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditLogs || []).length > 0 ? auditLogs.map((log: any) => (
                    <tr key={log.id} className="border-t">
                      <td className="px-3 py-2">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="px-3 py-2">{log.user_id?.substring(0, 8)}</td>
                      <td className="px-3 py-2">{log.action}</td>
                      <td className="px-3 py-2">{log.table_name}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No audit logs yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
            <Button variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export async function saveSettings(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const settings = ["auto_update", "auto_routing", "auto_offer_replacement", "auto_optimization", "ai_recommendations", "theme", "primary_color"]
  settings.forEach(key => {
    const value = formData.get(key)
    if (value !== null) {
      (supabase as any).from("app_settings").upsert({
        key,
        value: value === "on" ? true : value,
        updated_at: new Date().toISOString(),
      }, "key")
    }
  })
}
