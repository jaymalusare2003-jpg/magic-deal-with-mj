import { getProfile } from "@/lib/auth/require-auth"
import { createClient } from "@/lib/supabase/server"
import { StatCard, StatGrid } from "@/components/shared/stat-card"
import { LineChartCard, PieChartCard } from "@/components/shared/charts"
import {
  Search,
  Globe,
  BarChart3,
  ExternalLink,
  Zap,
  Target,
  Users,
  MousePointerClick,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AI_EMPLOYEES } from "@/lib/constants/navigation"
import Link from "next/link"

const mockTrafficOpportunities = [
  {
    id: 1,
    source: "Google SEO",
    type: "SEO",
    country: "US",
    category: "Finance",
    relevance: 94,
    score: 88,
    method: "Organic search for financial keywords",
    compliance: "Allowed",
    notes: "High volume, low competition keywords available",
  },
  {
    id: 2,
    source: "Facebook Ads",
    type: "Paid Ads",
    country: "GB",
    category: "E-commerce",
    relevance: 87,
    score: 76,
    method: "Targeted ad campaigns",
    compliance: "Verify with CPA network",
    notes: "Good CTR potential",
  },
  {
    id: 3,
    source: "Reddit Communities",
    type: "Community",
    country: "CA",
    category: "AI Tools",
    relevance: 82,
    score: 71,
    method: "Engage in relevant subreddits",
    compliance: "Allowed",
    notes: "Organic engagement required",
  },
  {
    id: 4,
    source: "YouTube SEO",
    type: "SEO",
    country: "AU",
    category: "Software",
    relevance: 78,
    score: 69,
    method: "Educational content optimization",
    compliance: "Allowed",
    notes: "Long-form content performs well",
  },
  {
    id: 5,
    source: "TikTok Ads",
    type: "Paid Ads",
    country: "US",
    category: "App Install",
    relevance: 91,
    score: 84,
    method: "Short-form video campaigns",
    compliance: "Verify with CPA network",
    notes: "High conversion for app installs",
  },
]

const mockTrafficTrend = [
  { date: "Mon", SEO: 120, Paid: 85, Social: 45, Community: 30 },
  { date: "Tue", SEO: 135, Paid: 92, Social: 52, Community: 35 },
  { date: "Wed", SEO: 110, Paid: 78, Social: 48, Community: 42 },
  { date: "Thu", SEO: 155, Paid: 105, Social: 61, Community: 38 },
  { date: "Fri", SEO: 180, Paid: 120, Social: 75, Community: 55 },
  { date: "Sat", SEO: 165, Paid: 95, Social: 68, Community: 48 },
  { date: "Sun", SEO: 140, Paid: 88, Social: 55, Community: 40 },
]

const trafficBySource = [
  { name: "SEO", value: 35 },
  { name: "Paid Ads", value: 28 },
  { name: "Social Media", value: 20 },
  { name: "Community", value: 17 },
]

export default async function TrafficResearchPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  const { data: opportunities } = await supabase
    .from("traffic_opportunities")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: sources } = await supabase.from("traffic_sources").select("id", { count: "exact" })

  const sourcesCount = sources?.length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Traffic Research</h1>
          <p className="text-sm text-muted-foreground">
            Discover and analyze traffic opportunities for your campaigns
          </p>
        </div>
        <Link href="/admin/ai-employees/workflow">
          <Button>
            <Search className="mr-2 h-4 w-4" />
            AI Traffic Analysis
          </Button>
        </Link>
      </div>

      <StatGrid>
        <StatCard title="Traffic Sources" value={sourcesCount} icon={Globe} change="Total sources" />
        <StatCard title="Opportunities Found" value={24} icon={Target} change="+5 from last week" changeType="increase" />
        <StatCard title="Avg Relevance Score" value="82%" icon={BarChart3} change="+3% this month" changeType="increase" />
        <StatCard title="Compliance Safe" value="78%" icon={Zap} change="Of opportunities" />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <LineChartCard data={mockTrafficTrend} dataKey="SEO" title="SEO Traffic Trend" description="Last 7 days" />
        <PieChartCard data={trafficBySource} title="Traffic by Source Type" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Opportunities</CardTitle>
          <CardDescription>
            AI-researched traffic opportunities scored by relevance and compliance safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Source</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Country</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Relevance</th>
                  <th className="text-left py-3 px-4 font-medium">Score</th>
                  <th className="text-left py-3 px-4 font-medium">Compliance</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockTrafficOpportunities.map((opp) => (
                  <tr key={opp.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{opp.source}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{opp.type}</Badge>
                    </td>
                    <td className="py-3 px-4">{opp.country}</td>
                    <td className="py-3 px-4">{opp.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${opp.relevance}%` }} />
                        </div>
                        <span>{opp.relevance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{opp.score}</td>
                    <td className="py-3 px-4">
                      {opp.compliance === "Allowed" ? (
                        <Badge className="bg-green-100 text-green-800">Allowed</Badge>
                      ) : (
                        <Badge variant="outline">{opp.compliance}</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Configuration</CardTitle>
          <CardDescription>Configure AI traffic research parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Research Topic</label>
              <input
                type="text"
                placeholder="e.g., Finance offers in US market"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Country</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>United States (US)</option>
                <option>United Kingdom (GB)</option>
                <option>Canada (CA)</option>
                <option>Australia (AU)</option>
              </select>
            </div>
          </div>
          <Button className="bg-primary">
            <Search className="mr-2 h-4 w-4" />
            Run AI Traffic Research
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
