import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { StatCard } from "@/components/shared/stat-card"
import { Download, FileText, Plus, Calendar, BarChart3 } from "lucide-react"
import { formatDate } from "@/lib/utils"

const REPORT_TEMPLATES = [
  { type: "daily", name: "Daily Report", description: "Automated daily performance summary" },
  { type: "weekly", name: "Weekly Report", description: "Weekly performance and trends" },
  { type: "monthly", name: "Monthly Report", description: "Monthly performance overview" },
  { type: "custom", name: "Custom Report", description: "Build a custom report with specific filters" },
]

const mockGeneratedReports = [
  { id: "1", title: "Weekly Performance Report - Jul 20-26", type: "weekly", date: "2024-07-26", status: "ready" },
  { id: "2", title: "Daily Report - Jul 25", type: "daily", date: "2024-07-25", status: "ready" },
  { id: "3", title: "Monthly Report - July 2024", type: "monthly", date: "2024-07-31", status: "ready" },
  { id: "4", title: "Weekly Performance Report - Jul 13-19", type: "weekly", date: "2024-07-19", status: "ready" },
]

const mockReportData = {
  executiveSummary: "This week saw a 12% increase in visitor traffic and 8% growth in conversions, driven by strong performance in the Finance and E-commerce categories.",
  topPerformers: [
    { name: "Finance - Credit Score", network: "AdsBlueMedia", revenue: 4500, conversions: 45 },
    { name: "VPN Signup", network: "CPAGrip", revenue: 3200, conversions: 38 },
    { name: "Crypto Exchange", network: "ClickDealer", revenue: 2800, conversions: 32 },
  ],
  lowPerformers: [
    { name: "Survey Entries", network: "CPAGrip", revenue: 450, conversions: 8, cr: "2.1%" },
    { name: "App Install - Games", network: "AdWorkMedia", revenue: 320, conversions: 5, cr: "1.2%" },
  ],
  trends: {
    revenue: "+15% vs last week",
    conversions: "+8% vs last week",
    visitors: "+12% vs last week",
    epc: "+3% vs last week",
  },
  opportunities: [
    "Expand Finance category campaigns to UK and Canada",
    "Increase budget for high-performing Crypto offer",
    "Test new landing page variants for App Install campaigns",
  ],
  risks: [
    "VPN offer payout decreased by 5% - monitor closely",
    "Survey offer showing declining conversion rate",
  ],
  recommendations: [
    "Reallocate budget from low-performing to high-performing offers",
    "Run A/B test on CTA for Finance offers",
    "Expand audience research for E-commerce campaigns in Australia",
  ],
}

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: offers } = await supabase.from("offers").select("id, name") as any
  const { data: networks } = await supabase.from("cpa_networks").select("id, name") as any
  const { data: countries } = await supabase.from("countries").select("code, name") as any
  const { data: campaigns } = await supabase.from("campaigns").select("id, name") as any

  const totalReports = mockGeneratedReports.length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and manage AI-powered performance reports</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      <StatCard title="Total Reports" value={totalReports} icon={FileText} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TEMPLATES.map((template) => (
          <Card key={template.type}>
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Title</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Type</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockGeneratedReports.map((report) => (
                  <tr key={report.id} className="border-t">
                    <td className="p-4 align-middle">{report.title}</td>
                    <td className="p-4 align-middle capitalize">{report.type}</td>
                    <td className="p-4 align-middle">{formatDate(report.date)}</td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
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
