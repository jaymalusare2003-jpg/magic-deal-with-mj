import { getProfile } from "@/lib/auth/require-auth"
import { createClient } from "@/lib/supabase/server"
import { StatCard, StatGrid } from "@/components/shared/stat-card"
import { LineChartCard, BarChartCard, PieChartCard, AreaChartCard } from "@/components/shared/charts"
import {
  LayoutDashboard,
  Target,
  Gift,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Users,
  Globe,
} from "lucide-react"

const mockVisitorTrend = [
  { date: "Mon", visitors: 1200, clicks: 450, conversions: 32 },
  { date: "Tue", visitors: 1400, clicks: 520, conversions: 38 },
  { date: "Wed", visitors: 1100, clicks: 390, conversions: 25 },
  { date: "Thu", visitors: 1600, clicks: 620, conversions: 45 },
  { date: "Fri", visitors: 1800, clicks: 720, conversions: 52 },
  { date: "Sat", visitors: 1500, clicks: 580, conversions: 41 },
  { date: "Sun", visitors: 1300, clicks: 490, conversions: 35 },
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

export default async function DashboardPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  const { data: networks } = await supabase.from("cpa_networks").select("id", { count: "exact" })
  const { data: offers } = await supabase.from("offers").select("id", { count: "exact" })
  const { count: campaignCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact" })

  const networksCount = networks?.length ?? 0
  const offersCount = offers?.length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {profile.full_name || profile.email}
          </p>
        </div>
      </div>

      <StatGrid>
        <StatCard
          title="Total Networks"
          value={networksCount}
          icon={LayoutDashboard}
          change="+2 from last month"
          changeType="increase"
        />
        <StatCard
          title="Total Offers"
          value={offersCount}
          icon={Gift}
          change="+15 this week"
          changeType="increase"
        />
        <StatCard
          title="Active Campaigns"
          value={campaignCount ?? 0}
          icon={Target}
          change="+3 from last week"
          changeType="increase"
        />
        <StatCard
          title="Total Revenue"
          value="$12,432.00"
          icon={DollarSign}
          change="+12% from last month"
          changeType="increase"
        />
        <StatCard
          title="Conversion Rate"
          value="4.2%"
          icon={TrendingUp}
          change="-0.3% from last week"
          changeType="decrease"
        />
        <StatCard
          title="Total Clicks"
          value="12,430"
          icon={MousePointerClick}
          change="+8% from last week"
          changeType="increase"
        />
        <StatCard
          title="Total Leads"
          value="523"
          icon={Users}
          change="+18% this week"
          changeType="increase"
        />
        <StatCard
          title="Top Country"
          value="United States"
          icon={Globe}
          change="35% of traffic"
        />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <AreaChartCard
          data={mockVisitorTrend}
          dataKey="visitors"
          title="Visitor Trend"
          description="Last 7 days"
        />
        <BarChartCard
          data={mockVisitorTrend}
          dataKey="conversions"
          xAxisKey="date"
          title="Conversions Over Time"
          description="Last 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <LineChartCard
          data={mockVisitorTrend}
          dataKey="clicks"
          title="Clicks Trend"
          description="Last 7 days"
        />
        <PieChartCard
          data={mockCountryData}
          title="Traffic by Country"
          description="Top countries"
        />
        <PieChartCard
          data={mockCategoryData}
          title="Traffic by Category"
          description="Category breakdown"
        />
      </div>
    </div>
  )
}
