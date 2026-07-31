import { createClient } from "@/lib/supabase/server"
import { StatCard, StatGrid } from "@/components/shared/stat-card"
import { AreaChartCard, BarChartCard, PieChartCard, LineChartCard } from "@/components/shared/charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MousePointerClick,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Target,
  BarChart3,
} from "lucide-react"

const mockVisitorTrend = [
  { date: "Mon", visitors: 1200, clicks: 450, conversions: 32, revenue: 3200 },
  { date: "Tue", visitors: 1400, clicks: 520, conversions: 38, revenue: 3800 },
  { date: "Wed", visitors: 1100, clicks: 390, conversions: 25, revenue: 2500 },
  { date: "Thu", visitors: 1600, clicks: 620, conversions: 45, revenue: 4500 },
  { date: "Fri", visitors: 1800, clicks: 720, conversions: 52, revenue: 5200 },
  { date: "Sat", visitors: 1500, clicks: 580, conversions: 41, revenue: 4100 },
  { date: "Sun", visitors: 1300, clicks: 490, conversions: 35, revenue: 3500 },
]

const mockCountryData = [
  { name: "United States", value: 35 },
  { name: "United Kingdom", value: 22 },
  { name: "Canada", value: 15 },
  { name: "Australia", value: 12 },
  { name: "Germany", value: 10 },
  { name: "Other", value: 6 },
]

const mockCategoryData = [
  { name: "Finance", value: 28 },
  { name: "App Install", value: 21 },
  { name: "E-commerce", value: 18 },
  { name: "Education", value: 12 },
  { name: "Software", value: 10 },
  { name: "Other", value: 11 },
]

const mockNetworkData = [
  { name: "AdsBlueMedia", value: 32 },
  { name: "CPAGrip", value: 28 },
  { name: "ClickDealer", value: 20 },
  { name: "AdWorkMedia", value: 12 },
  { name: "Other", value: 8 },
]

const mockCountryPerformance = [
  { country: "USA", clicks: 1200, conversions: 45, epc: 3.75, revenue: 4500 },
  { country: "UK", clicks: 850, conversions: 32, epc: 4.10, revenue: 3485 },
  { country: "Canada", clicks: 620, conversions: 28, epc: 3.92, revenue: 2430 },
  { country: "Australia", clicks: 540, conversions: 19, epc: 3.52, revenue: 1900 },
]

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: campaigns } = await supabase.from("campaigns").select("id, name") as any
  const { data: offers } = await supabase.from("offers").select("id, name") as any
  const { data: countries } = await supabase.from("countries").select("code, name") as any

  const totalVisitors = mockVisitorTrend.reduce((sum, d) => sum + d.visitors, 0)
  const totalClicks = mockVisitorTrend.reduce((sum, d) => sum + d.clicks, 0)
  const totalConversions = mockVisitorTrend.reduce((sum, d) => sum + d.conversions, 0)
  const totalRevenue = mockVisitorTrend.reduce((sum, d) => sum + d.revenue, 0)
  const cr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0.00"
  const epc = totalClicks > 0 ? (totalRevenue / totalClicks).toFixed(2) : "0.00"
  const leads = 523
  const commission = totalRevenue

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Comprehensive performance analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm rounded-lg border border-input bg-background px-3 py-2">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Today</option>
            <option>Yesterday</option>
          </select>
        </div>
      </div>

      <StatGrid>
        <StatCard title="Total Visitors" value={totalVisitors.toLocaleString()} icon={Users} change="+12% from last 7 days" changeType="increase" />
        <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointerClick} change="+8% from last 7 days" changeType="increase" />
        <StatCard title="Total Conversions" value={totalConversions.toLocaleString()} icon={Target} change="+5% from last 7 days" changeType="increase" />
        <StatCard title="Conversion Rate" value={`${cr}%`} icon={TrendingUp} change="-0.3% from last week" changeType="decrease" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} change="+15% from last 7 days" changeType="increase" />
        <StatCard title="EPC" value={`$${epc}`} icon={BarChart3} change="+0.25 from last week" changeType="increase" />
        <StatCard title="Total Leads" value={leads} icon={Users} change="+18% this week" changeType="increase" />
        <StatCard title="Commission" value={`$${commission.toLocaleString()}`} icon={DollarSign} change="+14% from last 7 days" changeType="increase" />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <LineChartCard data={mockVisitorTrend} dataKey="visitors" title="Visitor Trend" description="Last 7 days" />
        <BarChartCard data={mockVisitorTrend} dataKey="conversions" title="Conversion Trend" description="Last 7 days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <LineChartCard data={mockVisitorTrend} dataKey="clicks" title="Click Trend" description="Last 7 days" />
        <AreaChartCard data={mockVisitorTrend} dataKey="revenue" title="Revenue Trend" description="Last 7 days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PieChartCard data={mockCountryData} title="Traffic by Country" description="Top countries by visitors" />
        <PieChartCard data={mockCategoryData} title="Traffic by Category" description="Category breakdown" />
        <PieChartCard data={mockNetworkData} title="Traffic by Network" description="Network breakdown" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Country Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Country</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Clicks</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Conversions</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">EPC</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {mockCountryPerformance.map((c) => (
                  <tr key={c.country} className="border-t">
                    <td className="p-4 align-middle">{c.country}</td>
                    <td className="p-4 align-middle">{c.clicks}</td>
                    <td className="p-4 align-middle">{c.conversions}</td>
                    <td className="p-4 align-middle">${c.epc}</td>
                    <td className="p-4 align-middle">${c.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
