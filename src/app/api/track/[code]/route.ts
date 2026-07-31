import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code") || searchParams.get("short_code")

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  const supabase = await createClient()

  const { data: link, error } = await (supabase as any)
    .from("tracking_links")
    .select("*")
    .eq("short_code", code)
    .single()

  if (!link || error) {
    try {
      const { data: campaign } = await (supabase as any)
        .from("campaigns")
        .select("*")
        .eq("slug", code)
        .single()
      if (campaign) {
        return NextResponse.redirect(new URL(`/campaign/${campaign.slug}`, request.url))
      }
    } catch {}
    return NextResponse.redirect(new URL("/", request.url))
  }

  await (supabase as any).from("visits").insert({
    tracking_link_id: link.id,
    ip_hash: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
    country: request.headers.get("x-vercel-ip-country") || "unknown",
    user_agent: request.headers.get("user-agent") || "",
    referrer: request.headers.get("referer") || "",
    timestamp: new Date().toISOString(),
    converted: false,
  })

  await (supabase as any)
    .from("tracking_links")
    .update({ clicks: (link.clicks || 0) + 1 })
    .eq("id", link.id)

  await (supabase as any).from("analytics_events").insert({
    event_type: "click",
    tracking_link_id: link.id,
    campaign_id: link.campaign_id,
    timestamp: new Date().toISOString(),
    value: 1,
  })

  return NextResponse.redirect(new URL(link.url, request.url))
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "POST to /api/track/[code] for tracking" })
}
