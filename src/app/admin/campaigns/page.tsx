import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable } from "@/components/shared/data-table"
import Link from "next/link"
import { Copy, Plus, Edit, Search, Globe, BarChart3, QrCode, Link2 } from "lucide-react"
import { useState } from "react"

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false }) as any

  const { data: offers } = await supabase.from("offers").select("id, name") as any
  const { data: networks } = await supabase.from("cpa_networks").select("id, name") as any
  const { data: categories } = await supabase.from("categories").select("id, name") as any
  const { data: countries } = await supabase.from("countries").select("code, name") as any
  const { data: landingPages } = await supabase.from("landing_pages").select("id, name, slug") as any

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your CPA affiliate campaigns</p>
        </div>
        <CampaignDialog
          offers={offers || []}
          networks={networks || []}
          categories={categories || []}
          countries={countries || []}
          landingPages={landingPages || []}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Campaigns" value={(campaigns || []).length} icon={BarChart3} />
        <StatCard title="Active" value={(campaigns || []).filter((c: any) => c.status === "active").length} icon={Globe} />
        <StatCard title="Drafts" value={(campaigns || []).filter((c: any) => c.status === "draft").length} icon={Search} />
        <StatCard title="Completed" value={(campaigns || []).filter((c: any) => c.status === "completed").length} icon={BarChart3} />
      </div>

       <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Campaign",
            cell: ({ row }: { row: { original: any } }) => (
              <div>
                <div className="font-medium">{row.original.name}</div>
                <div className="text-xs text-muted-foreground">{row.original.notes?.substring(0, 60)}...</div>
              </div>
            ),
          },
          {
            accessorKey: "offer_id",
            header: "Offer",
            cell: ({ row }: { row: { original: any } }) => {
              const offer = (offers || []).find((o: any) => o.id === row.original.offer_id)
              return <span className="text-sm">{offer?.name || "—"}</span>
            },
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: any } }) => {
              const variants = { draft: "bg-gray-100 text-gray-800", active: "bg-green-100 text-green-800", paused: "bg-yellow-100 text-yellow-800", completed: "bg-blue-100 text-blue-800" }
              return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[row.original.status as keyof typeof variants] || variants.draft}`}>{row.original.status}</span>
            },
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: any } }) => (
              <div className="flex gap-1">
                <Link href={`/campaign/${row.original.slug || row.original.name}`}>
                  <Button size="sm" variant="outline" title="Public URL">
                    <Link2 className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline" title="UTM Link Generator">
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            ),
          },
        ]}
        data={campaigns || []}
        searchKey="name"
        searchPlaceholder="Search campaigns..."
      />
    </div>
  )
}

function CampaignDialog({ offers, networks, categories, countries, landingPages }: {
  offers: any[]
  networks: any[]
  categories: any[]
  countries: any[]
  landingPages: any[]
}) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Campaign
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Campaign</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <form action={saveCampaign} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input name="name" placeholder="e.g. Summer Sale USA" required />
            </div>
            <div>
              <Label>Slug</Label>
              <Input name="slug" placeholder="auto-generated" />
            </div>
            <div>
              <Label>Offer *</Label>
              <select name="offer_id" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Offer</option>
                {offers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Country *</Label>
              <select name="country_id" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Country</option>
                {countries.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
              </select>
            </div>
            <div>
              <Label>Category</Label>
              <select name="category_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Landing Page</Label>
              <select name="landing_page_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Landing Page</option>
                {landingPages.map(lp => <option key={lp.id} value={lp.id}>{lp.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select name="status" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <Label>Budget ($)</Label>
              <Input name="budget" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input name="start_date" type="date" />
            </div>
            <div>
              <Label>End Date</Label>
              <Input name="end_date" type="date" />
            </div>
            <div className="md:col-span-2">
              <Label>Country-Offer Mapping (JSON)</Label>
              <textarea name="country_offer_mapping" placeholder='{"US": "offer-a-id", "UK": "offer-b-id"}' className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono" rows={4} />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea name="notes" placeholder="Additional notes..." />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg">Create Campaign</button>
          </div>
        </form>
      </div>
    </div>
  )
}

async function saveCampaign(formData: FormData) {
  "use server"
  const supabase = await createClient()
  const updates: Record<string, any> = {}
  const fields = ["name", "slug", "offer_id", "cpa_network_id", "category_id", "country_id", "landing_page_id", "status", "budget", "start_date", "end_date", "country_offer_mapping", "traffic_source_id", "notes"]
  fields.forEach(f => { updates[f] = formData.get(f) })
  await (supabase as any).from("campaigns").insert(updates)
}
