"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#a855f7"]

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <div className={className}>
      <div className="bg-card border rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

export function LineChartCard({
  data,
  dataKey,
  xAxisKey = "date",
  title,
  description,
  color = "#2563eb",
  yAxisFormatter,
}: {
  data: any[]
  dataKey: string
  xAxisKey?: string
  title: string
  description?: string
  color?: string
  yAxisFormatter?: (value: number) => string
}) {
  return (
    <ChartCard title={title} description={description} className="col-span-2">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={yAxisFormatter} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function BarChartCard({
  data,
  dataKey,
  xAxisKey = "name",
  title,
  description,
  color = "#2563eb",
}: {
  data: any[]
  dataKey: string
  xAxisKey?: string
  title: string
  description?: string
  color?: string
}) {
  return (
    <ChartCard title={title} description={description} className="col-span-2">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function PieChartCard({
  data,
  nameKey = "name",
  dataKey = "value",
  title,
  description,
}: {
  data: any[]
  nameKey?: string
  dataKey?: string
  title: string
  description?: string
}) {
  const displayData = data.slice(0, 8)
  return (
    <ChartCard title={title} description={description}>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={displayData}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
          >
            {displayData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export function AreaChartCard({
  data,
  dataKey,
  xAxisKey = "date",
  title,
  description,
  color = "#2563eb",
}: {
  data: any[]
  dataKey: string
  xAxisKey?: string
  title: string
  description?: string
  color?: string
}) {
  return (
    <ChartCard title={title} description={description} className="col-span-3">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
