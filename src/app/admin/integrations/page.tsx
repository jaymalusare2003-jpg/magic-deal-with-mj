import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/shared/stat-card"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, TestTube, Settings } from "lucide-react"

const INTEGRATIONS = [
  {
    id: "openai",
    name: "OpenAI",
    description: "AI model API for AI Employee system",
    type: "ai_api",
    icon: "🤖",
    envVar: "OPENAI_API_KEY",
    status: "connected",
    config: ["api_key", "default_model", "max_tokens"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "PostgreSQL database and authentication",
    type: "database",
    icon: "🗄️",
    envVar: "NEXT_PUBLIC_SUPABASE_URL",
    status: "connected",
    config: ["url", "anon_key"],
  },
  {
    id: "adsbluemedia",
    name: "AdsBlueMedia",
    description: "CPA Network API integration",
    type: "cpa_network",
    icon: "🔵",
    envVar: "ADBS_API_KEY",
    status: "connected",
    config: ["api_key", "api_endpoint", "postback_url"],
  },
  {
    id: "cpagrip",
    name: "CPAGrip",
    description: "CPA Network API integration",
    type: "cpa_network",
    icon: "🟢",
    envVar: "CPAGRIP_API_KEY",
    status: "connected",
    config: ["api_key", "api_endpoint", "postback_url"],
  },
  {
    id: "bitly",
    name: "Bitly",
    description: "URL shortening service",
    type: "url_shortener",
    icon: "🔗",
    envVar: "BITLY_ACCESS_TOKEN",
    status: "disconnected",
    config: ["access_token", "domain"],
  },
]

const statusIcons = {
  connected: CheckCircle,
  disconnected: XCircle,
  error: AlertCircle,
}

const statusColors = {
  connected: "text-green-600",
  disconnected: "text-gray-600",
  error: "text-red-600",
}

export default async function IntegrationsPage() {
  const supabase = await createClient()
  const { data: integrations } = await supabase.from("integrations").select("*") as any

  const connectedCount = INTEGRATIONS.filter(i => i.status === "connected").length
  const disconnectedCount = INTEGRATIONS.filter(i => i.status === "disconnected").length
  const errorCount = INTEGRATIONS.filter(i => i.status === "error").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted-foreground">Manage third-party integrations and API connections</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Connected" value={connectedCount} icon="CheckCircle" />
        <StatCard title="Disconnected" value={disconnectedCount} icon="XCircle" />
        <StatCard title="Errors" value={errorCount} icon="AlertCircle" />
      </div>

      <div className="space-y-4">
        {INTEGRATIONS.map((integration) => {
          const StatusIcon = statusIcons[integration.status as keyof typeof statusIcons]
          return (
            <Card key={integration.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  {integration.name}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${integration.status === "connected" ? "bg-green-100 text-green-800" : integration.status === "error" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                    <StatusIcon className={`h-3 w-3 ${statusColors[integration.status as keyof typeof statusColors]}`} />
                    {integration.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                <div className="mb-3">
                  <Label>Environment Variable</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded">{integration.envVar}</code>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Configuration Fields</Label>
                  {integration.config.map((field) => (
                    <div key={field} className="flex items-center gap-2">
                      <Input
                        type={field.includes("key") || field.includes("token") ? "password" : "text"}
                        placeholder={field}
                        defaultValue="••••••••••••"
                      />
                      <Button size="sm" variant="outline">
                        <TestTube className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
