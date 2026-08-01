import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/shared/stat-card"
import { Shield, CheckCircle, AlertCircle, X, FileCheck } from "lucide-react"

const COMPLIANCE_STATUSES = ["allowed", "not_allowed", "unknown"] as const

const mockCompliance = [
  {
    id: "1",
    offer: "Finance - Credit Score",
    network: "AdsBlueMedia",
    email: "allowed",
    social: "not_allowed",
    paidAds: "allowed",
    search: "allowed",
    incentive: "unknown",
    directLinking: "allowed",
    landingPage: "required",
    verified: true,
  },
  {
    id: "2",
    offer: "VPN Signup Bonus",
    network: "CPAGrip",
    email: "allowed",
    social: "allowed",
    paidAds: "unknown",
    search: "not_allowed",
    incentive: "not_allowed",
    directLinking: "not_allowed",
    landingPage: "required",
    verified: false,
  },
  {
    id: "3",
    offer: "Survey Rewards",
    network: "ClickDealer",
    email: "allowed",
    social: "not_allowed",
    paidAds: "allowed",
    search: "allowed",
    incentive: "allowed",
    directLinking: "not_allowed",
    landingPage: "unknown",
    verified: true,
  },
]

function StatusBadge({ status }: { status: string }) {
  const variants = {
    allowed: "bg-green-100 text-green-800",
    not_allowed: "bg-red-100 text-red-800",
    unknown: "bg-yellow-100 text-yellow-800",
    required: "bg-blue-100 text-blue-800",
    not_required: "bg-gray-100 text-gray-800",
  }
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status as keyof typeof variants] || variants.unknown}`}>
      {status.replace("_", " ")}
    </span>
  )
}

export default async function CompliancePage() {
  const supabase = await createClient()
  const { data: offers } = await supabase.from("offers").select("id, name") as any

  const allowedCount = mockCompliance.filter(c => c.email === "allowed").length
  const flaggedCount = mockCompliance.filter(c => c.email === "unknown" || c.social === "unknown" || c.paidAds === "unknown").length
  const verifiedCount = mockCompliance.filter(c => c.verified).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compliance Center</h1>
          <p className="text-sm text-muted-foreground">Monitor offer compliance across traffic sources</p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Run Compliance Check
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Verified" value={verifiedCount} icon="CheckCircle" />
        <StatCard title="Needs Verification" value={mockCompliance.length - verifiedCount} icon="AlertCircle" />
        <StatCard title="Flagged Unknown" value={flaggedCount} icon="Shield" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Offer</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Network</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Social</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Paid Ads</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Search</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Incentivized</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Direct Linking</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Landing Page</th>
                  <th className="h-12 px-4 text-left font-medium text-muted-foreground">Verified</th>
                </tr>
              </thead>
              <tbody>
                {mockCompliance.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-4 align-middle font-medium">{c.offer}</td>
                    <td className="p-4 align-middle">{c.network}</td>
                    <td className="p-4 align-middle"><StatusBadge status={c.email} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.social} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.paidAds} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.search} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.incentive} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.directLinking} /></td>
                    <td className="p-4 align-middle"><StatusBadge status={c.landingPage} /></td>
                    <td className="p-4 align-middle">
                      {c.verified ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-yellow-600" />}
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
          <CardTitle>Compliance Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <p><strong>Verify with CPA network before launching:</strong> Any offer marked "unknown" in traffic rules must be verified with the CPA network before campaign launch.</p>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <p><strong>Landing page required:</strong> Offers with "required" landing page rules must not be promoted with direct linking.</p>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <p><strong>Compliance audit:</strong> Run monthly compliance audits on all active campaigns to ensure continued adherence to network rules.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
