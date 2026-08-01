import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const formData = await request.formData()

  const updates: Record<string, any> = {}
  const fields = [
    "name", "slug", "offer_id", "cpa_network_id", "category_id",
    "country_id", "landing_page_id", "traffic_source_id", "status",
    "budget", "start_date", "end_date", "country_offer_mapping", "notes"
  ]
  fields.forEach(f => {
    const value = formData.get(f)
    if (value !== null && value !== "") updates[f] = value
  })

  const { data, error } = await (supabase as any)
    .from("campaigns")
    .insert(updates)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await (supabase as any)
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
