"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "increase" | "decrease"
  icon?: LucideIcon
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-card border rounded-xl p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === "increase" ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  changeType === "increase"
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  )
}
