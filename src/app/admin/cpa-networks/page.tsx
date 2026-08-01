"use client"

import { createClient } from "@/lib/supabase/client"
import { CrudPage } from "@/components/shared/crud-page"
import { Network } from "lucide-react"
import type { CrudConfig } from "@/components/shared/crud-page"

export default function CpaNetworksPage() {
  const config: CrudConfig = {
    table: "cpa_networks",
    title: "CPA Networks",
    description: "Manage CPA affiliate networks",
    searchKey: "name",
    columns: [
      {
        key: "name",
        header: "Network Name",
        render: (row: any) => (
          <div className="flex items-center gap-3">
            {row.logo_url ? (
              <img src={row.logo_url} alt={row.name} className="h-8 w-8 rounded object-cover" />
            ) : (
              <Network className="h-8 w-8 text-muted-foreground" />
            )}
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      { key: "website", header: "Website" },
      {
        key: "status",
        header: "Status",
        render: (row: any) => {
          const variants = { active: "bg-green-100 text-green-800", inactive: "bg-gray-100 text-gray-800", pending: "bg-yellow-100 text-yellow-800" }
          return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[row.status as keyof typeof variants] || variants.pending}`}>{row.status}</span>
        },
      },
      {
        key: "affiliate_id",
        header: "Affiliate ID",
        render: (row: any) => <span className="text-sm text-muted-foreground">{row.affiliate_id || "—"}</span>,
      },
    ],
    fields: [
      { name: "name", label: "Network Name", type: "text", required: true, placeholder: "e.g. AdsBlueMedia" },
      { name: "logo_url", label: "Logo URL", type: "url", placeholder: "https://example.com/logo.png" },
      { name: "website", label: "Website", type: "url", placeholder: "https://example.com" },
      { name: "affiliate_id", label: "Affiliate ID", type: "text", placeholder: "Your affiliate ID" },
      { name: "api_integration", label: "API Integration", type: "select", options: [
        { value: "none", label: "None" },
        { value: "csv", label: "CSV Import" },
        { value: "custom", label: "Custom API" },
        { value: "official", label: "Official API" },
      ]},
      { name: "api_credentials", label: "API Credentials", type: "text", placeholder: "Encrypted credentials" },
      { name: "postback_url", label: "Postback URL", type: "url", placeholder: "https://..." },
      { name: "status", label: "Status", type: "select", required: true, options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ]},
      { name: "notes", label: "Notes", type: "textarea", placeholder: "Additional notes...", colSpan: 2 },
    ],
  }

  return <CrudPage config={config} />
}
