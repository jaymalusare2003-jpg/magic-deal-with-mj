"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/shared/stat-card"
import { DataTable } from "@/components/shared/data-table"
import { CampaignDialog } from "@/components/admin/campaign-dialog"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Copy, Plus, Edit, Search, Globe, BarChart3, QrCode, Link2 } from "lucide-react"

export default function CampaignsPage() {
  const supabase = createClient()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [networks, setNetworks] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [landingPages, setLandingPages] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: campaignData } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false })
      const { data: offerData } = await supabase.from("offers").select("id, name")
      const { data: networkData } = await supabase.from("cpa_networks").select("id, name")
      const { data: categoryData } = await supabase.from("categories").select("id, name")
      const { data: countryData } = await supabase.from("countries").select("code, name")
      const { data: lpData } = await supabase.from("landing_pages").select("id, name, slug")

      setCampaigns(campaignData || [])
      setOffers(offerData || [])
      setNetworks(networkData || [])
      setCategories(categoryData || [])
      setCountries(countryData || [])
      setLandingPages(lpData || [])
    }
    fetchData()
  }, [])

  const columns = [
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
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage your CPA affiliate campaigns</p>
        </div>
        <CampaignDialog
          offers={offers}
          networks={networks}
          categories={categories}
          countries={countries}
          landingPages={landingPages}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Campaigns" value={campaigns.length} icon="BarChart3" />
        <StatCard title="Active" value={campaigns.filter((c: any) => c.status === "active").length} icon="Globe" />
        <StatCard title="Drafts" value={campaigns.filter((c: any) => c.status === "draft").length} icon="Search" />
        <StatCard title="Completed" value={campaigns.filter((c: any) => c.status === "completed").length} icon="BarChart3" />
      </div>

      <DataTable
        columns={columns as any}
        data={campaigns}
        searchKey="name"
        searchPlaceholder="Search campaigns..."
      />
    </div>
  )
}
