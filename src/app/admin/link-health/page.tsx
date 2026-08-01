"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { RefreshCw, AlertCircle, CheckCircle, Clock, PauseCircle } from "lucide-react"

const STATUS_TYPES = {
  active: { color: "bg-green-100 text-green-800", icon: CheckCircle, iconColor: "text-green-600" },
  warning: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, iconColor: "text-yellow-600" },
  broken: { color: "bg-red-100 text-red-800", icon: AlertCircle, iconColor: "text-red-600" },
  expired: { color: "bg-orange-100 text-orange-800", icon: PauseCircle, iconColor: "text-orange-600" },
  unknown: { color: "bg-gray-100 text-gray-800", icon: Clock, iconColor: "text-gray-600" },
}

const mockLinks = [
  { id: "1", url: "https://adsbluemedia.com/offer/123", status: "active", lastChecked: "2024-07-30 14:30", httpStatus: 200, responseTime: 0.342, offer: "Credit Score", campaign: "Finance US" },
  { id: "2", url: "https://cpagrip.com/p/offer456", status: "active", lastChecked: "2024-07-30 14:25", httpStatus: 200, responseTime: 0.512, offer: "VPN Signup", campaign: "Privacy Tools" },
  { id: "3", url: "https://clickdealer.com/broken-offer", status: "broken", lastChecked: "2024-07-30 14:20", httpStatus: 404, responseTime: null, offer: "Survey Entry", campaign: "Survey Campaign" },
  { id: "4", url: "https://cpagrip.com/p/expired-offer", status: "expired", lastChecked: "2024-07-30 14:15", httpStatus: 403, responseTime: null, offer: "App Install", campaign: "Mobile Apps" },
  { id: "5", url: "https://adsbluemedia.com/offer/456", status: "warning", lastChecked: "2024-07-30 14:10", httpStatus: 302, responseTime: 1.234, offer: "Crypto Exchange", campaign: "Crypto Q3" },
]

export default async function LinkHealthPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState("2024-07-30 14:30")

  const activeCount = mockLinks.filter(l => l.status === "active").length
  const warningCount = mockLinks.filter(l => l.status === "warning").length
  const brokenCount = mockLinks.filter(l => l.status === "broken").length
  const expiredCount = mockLinks.filter(l => l.status === "expired").length

  const handleCheckAll = async () => {
    setIsChecking(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsChecking(false)
    setLastChecked(new Date().toLocaleString())
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Link Health Monitor</h1>
          <p className="text-sm text-muted-foreground">Monitor affiliate link availability and health</p>
        </div>
        <Button onClick={handleCheckAll} disabled={isChecking}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Checking..." : "Check All Links"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">Last checked: {lastChecked}</p>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Active" value={activeCount} icon="CheckCircle" />
        <StatCard title="Warning" value={warningCount} icon="AlertCircle" />
        <StatCard title="Broken" value={brokenCount} icon="AlertCircle" />
        <StatCard title="Expired" value={expiredCount} icon="PauseCircle" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">URL</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Offer</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Campaign</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">HTTP Status</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Response Time</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {mockLinks.map((link) => {
                  const statusConfig = STATUS_TYPES[link.status as keyof typeof STATUS_TYPES]
                  return (
                    <tr key={link.id} className="border-t">
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon && <statusConfig.icon className={`h-3 w-3 ${statusConfig.iconColor}`} />}
                          {link.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {link.url.substring(0, 50)}...
                        </a>
                      </td>
                      <td className="p-4 align-middle">{link.offer}</td>
                      <td className="p-4 align-middle">{link.campaign}</td>
                      <td className="p-4 align-middle">{link.httpStatus || "—"}</td>
                      <td className="p-4 align-middle">{link.responseTime ? `${link.responseTime}s` : "—"}</td>
                      <td className="p-4 align-middle text-muted-foreground">{link.lastChecked}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
