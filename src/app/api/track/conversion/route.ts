import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tracking_code, event_type, value, metadata } = body

    if (!tracking_code || !event_type) {
      return NextResponse.json({ error: "tracking_code and event_type are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: link, error: linkError } = await (supabase as any)
      .from("tracking_links")
      .select("*")
      .eq("short_code", tracking_code)
      .single()

    if (!link || linkError) {
      return NextResponse.json({ error: "Tracking link not found" }, { status: 404 })
    }

    const updates: Record<string, any> = {}
    if (event_type === "conversion" || event_type === "lead") {
      updates.conversions = (link.conversions || 0) + 1
      updates.leads = (link.leads || 0) + 1
      if (value) updates.revenue = (link.revenue || 0) + Number(value)
    } else if (event_type === "lead") {
      updates.leads = (link.leads || 0) + 1
    } else if (event_type === "sale" || event_type === "revenue") {
      updates.conversions = (link.conversions || 0) + 1
      if (value) updates.revenue = (link.revenue || 0) + Number(value)
    }

    await (supabase as any).from("tracking_links").update(updates).eq("id", link.id)

    await (supabase as any).from("analytics_events").insert({
      event_type,
      tracking_link_id: link.id,
      campaign_id: link.campaign_id,
      value: value ? Number(value) : null,
      metadata: metadata || null,
      timestamp: new Date().toISOString(),
    })

    if (event_type === "conversion") {
      await (supabase as any).from("visits").update({ converted: true }).eq("tracking_link_id", link.id)
    }

    return NextResponse.json({ success: true, tracking_link: link.id })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "POST conversion data to this endpoint" })
}
