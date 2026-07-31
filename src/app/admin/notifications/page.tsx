"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bell, CheckCheck, Trash2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Label } from "@/components/ui/label"

const NOTIFICATION_TYPES = ["all", "info", "warning", "error", "success"]

const mockNotifications = [
  { id: "1", title: "New Offer Added", message: "Finance - Credit Score offer added to AdsBlueMedia", type: "success", read: false, time: "20 min ago", action: "/admin/offers" },
  { id: "2", title: "Offer Expired", message: "Survey Rewards offer has expired on CPAGrip", type: "error", read: false, time: "1 hour ago", action: "/admin/offers" },
  { id: "3", title: "Payout Changed", message: "VPN Signup payout changed from $3.50 to $4.00", type: "warning", read: true, time: "3 hours ago", action: "/admin/offers" },
  { id: "4", title: "API Sync Failure", message: "Failed to sync offers from ClickDealer API", type: "error", read: false, time: "5 hours ago", action: "/admin/integrations" },
  { id: "5", title: "Compliance Warning", message: "Unknown traffic rules for App Install offer", type: "warning", read: true, time: "1 day ago", action: "/admin/compliance" },
  { id: "6", title: "AI Report Ready", message: "Weekly performance report has been generated", type: "info", read: true, time: "1 day ago", action: "/admin/reports" },
]

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const typeColors = {
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = filter === "all"
    ? notifications
    : notifications.filter(n => n.type === filter)

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notification(s)</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm rounded-lg border border-input bg-background px-3 py-2"
          >
            <option value="all">All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["New Offer", "Offer Expired", "Offer Paused", "Payout Changed", "Traffic Rules Changed", "Affiliate Link Changed", "API Sync Failure", "Tracking Failure", "Compliance Warning", "AI Report Ready"].map((setting) => (
              <div key={setting} className="flex items-center justify-between">
                <Label>{setting}</Label>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = (typeIcons as Record<string, typeof CheckCircle>)[notification.type]
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.read ? "bg-muted/50" : ""}`}
                >
                  <div className={`mt-0.5 p-1 rounded ${typeColors[notification.type as keyof typeof typeColors]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead(notification.id)}>
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications to show.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
