"use client"

import { createClient } from "@/lib/supabase/client"
import { CrudPage } from "@/components/shared/crud-page"
import type { CrudConfig } from "@/components/shared/crud-page"
import { useEffect, useState } from "react"

export default function OffersPage() {
  const supabase = createClient()
  const [networkOptions, setNetworkOptions] = useState<Array<{ value: string; label: string }>>([])
  const [categoryOptions, setCategoryOptions] = useState<Array<{ value: string; label: string }>>([])
  const [countryOptions, setCountryOptions] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    const fetchOptions = async () => {
      const { data: networks } = await supabase.from("cpa_networks").select("id, name")
      const { data: categories } = await supabase.from("categories").select("id, name")
      const { data: countries } = await supabase.from("countries").select("code, name")

      setNetworkOptions((networks || []).map((n: any) => ({ value: n.id, label: n.name })))
      setCategoryOptions((categories || []).map((c: any) => ({ value: c.id, label: c.name })))
      setCountryOptions((countries || []).map((c: any) => ({ value: c.code, label: `${c.name} (${c.code})` })))
    }
    fetchOptions()
  }, [])

  const config: CrudConfig = {
    table: "offers",
    title: "Offers",
    description: "Centralized offer management across all CPA networks",
    searchKey: "name",
    columns: [
      { key: "name", header: "Offer Name" },
      {
        key: "cpa_network_id",
        header: "Network",
        render: (row: any) => {
          return <span className="text-sm">{(row.cpa_network_id || "—")}</span>
        },
      },
      {
        key: "category_id",
        header: "Category",
        render: (row: any) => {
          return <span className="text-sm">{(row.category_id || "—")}</span>
        },
      },
      { key: "payout", header: "Payout", render: (row: any) => <span className="font-medium">{row.currency} {row.payout}</span> },
      {
        key: "status",
        header: "Status",
        render: (row: any) => {
          const variants = {
            active: "bg-green-100 text-green-800",
            paused: "bg-yellow-100 text-yellow-800",
            pending: "bg-blue-100 text-blue-800",
            expired: "bg-red-100 text-red-800",
            rejected: "bg-gray-100 text-gray-800",
          }
          return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[row.status as keyof typeof variants] || variants.pending}`}>{row.status}</span>
        },
      },
    ],
    fields: [
      { name: "name", label: "Offer Name", type: "text", required: true, placeholder: "e.g. Lead Gen Survey" },
      { name: "cpa_network_id", label: "CPA Network", type: "select", required: true, options: networkOptions },
      { name: "category_id", label: "Category", type: "select", options: categoryOptions },
      { name: "description", label: "Description", type: "textarea", colSpan: 2, placeholder: "Offer description..." },
      { name: "affiliate_url", label: "Affiliate URL", type: "url", required: true, placeholder: "https://...", colSpan: 2 },
      { name: "tracking_url", label: "Tracking URL", type: "url", placeholder: "https://tracking-url.com" },
      { name: "target_countries", label: "Target Countries", type: "select", multiple: true, options: countryOptions },
      { name: "payout", label: "Payout", type: "number", placeholder: "0.00" },
      { name: "currency", label: "Currency", type: "select", options: [
        { value: "USD", label: "USD - US Dollar" },
        { value: "EUR", label: "EUR - Euro" },
        { value: "GBP", label: "GBP - British Pound" },
        { value: "CAD", label: "CAD - Canadian Dollar" },
        { value: "AUD", label: "AUD - Australian Dollar" },
      ]},
      { name: "conversion_type", label: "Conversion Type", type: "select", options: [
        { value: "cpa", label: "CPA - Cost Per Action" },
        { value: "cpc", label: "CPC - Cost Per Click" },
        { value: "cps", label: "CPS - Cost Per Sale" },
        { value: "cpm", label: "CPM - Cost Per Mille" },
        { value: "hybrid", label: "Hybrid" },
      ]},
      { name: "allowed_traffic", label: "Allowed Traffic", type: "select", multiple: true, options: [
        { value: "email", label: "Email" }, { value: "social", label: "Social" }, { value: "paid", label: "Paid Ads" }, { value: "search", label: "Search" }, { value: "incent", label: "Incentive" },
      ]},
      { name: "restricted_traffic", label: "Restricted Traffic", type: "select", multiple: true, options: [
        { value: "email", label: "Email" }, { value: "social", label: "Social" }, { value: "paid", label: "Paid Ads" }, { value: "search", label: "Search" }, { value: "incent", label: "Incentive" },
      ]},
      { name: "status", label: "Status", type: "select", required: true, options: [
        { value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "pending", label: "Pending" }, { value: "expired", label: "Expired" }, { value: "rejected", label: "Rejected" },
      ]},
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" },
      { name: "notes", label: "Notes", type: "textarea", colSpan: 2, placeholder: "Additional notes..." },
    ],
  }

  return <CrudPage config={config} />
}
