"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { CrudPage } from "@/components/shared/crud-page"
import type { CrudConfig } from "@/components/shared/crud-page"

export default function TrafficSourcesPage() {
  const [countryOptions, setCountryOptions] = useState<Array<{ value: string; label: string }>>([])

  useEffect(() => {
    const fetchOptions = async () => {
      const supabase = createClient()
      const { data: countries } = await supabase.from("countries").select("code, name")
      setCountryOptions((countries || []).map((c: any) => ({ value: c.code, label: `${c.name} (${c.code})` })))
    }
    fetchOptions()
  }, [])

  const config: CrudConfig = {
    table: "traffic_sources",
    title: "Traffic Sources",
    description: "Manage traffic sources and channels",
    searchKey: "name",
    columns: [
      { key: "name", header: "Source Name" },
      { key: "type", header: "Type" },
      { key: "country", header: "Country" },
      {
        key: "active",
        header: "Active",
        render: (row: any) => <span className={row.active ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{row.active ? "Yes" : "No"}</span>,
      },
    ],
    fields: [
      { name: "name", label: "Source Name", type: "text", required: true, placeholder: "e.g. Google Ads" },
      { name: "type", label: "Type", type: "select", required: true, options: [
        { value: "paid_search", label: "Paid Search" },
        { value: "social_media", label: "Social Media" },
        { value: "email", label: "Email" },
        { value: "organic_search", label: "Organic Search" },
        { value: "display", label: "Display" },
        { value: "video", label: "Video" },
        { value: "push", label: "Push Notification" },
        { value: "pinterest", label: "Pinterest" },
        { value: "youtube", label: "YouTube" },
        { value: "other", label: "Other" },
      ]},
      { name: "country", label: "Country", type: "select", options: countryOptions },
      { name: "description", label: "Description", type: "textarea", colSpan: 2, placeholder: "Description..." },
      { name: "settings", label: "Settings (JSON)", type: "json", colSpan: 2, placeholder: '{"key": "value"}' },
      { name: "active", label: "Active", type: "switch" },
    ],
  }

  return <CrudPage config={config} />
}
