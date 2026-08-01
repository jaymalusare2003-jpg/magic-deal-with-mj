import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { generateId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, source, medium, campaign: campaignName, content, term, country } = body

    if (!campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: campaign, error: campaignError } = await (supabase as any)
      .from("campaigns")
      .select("*, landing_pages(*)")
      .eq("id", campaignId)
      .single()

    if (!campaign || campaignError) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const baseUrl = campaign.landing_pages?.slug
      ? `https://${process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || process.env.VERCEL_URL || "localhost:3000"}/campaign/${campaign.landing_pages.slug}`
      : `https://${process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || process.env.VERCEL_URL || "localhost:3000"}/campaign/${campaign.slug || campaign.name}`

    const utmParams = new URLSearchParams()
    if (source) utmParams.set("utm_source", source)
    if (medium) utmParams.set("utm_medium", medium)
    if (campaignName) utmParams.set("utm_campaign", campaignName)
    if (content) utmParams.set("utm_content", content)
    if (term) utmParams.set("utm_term", term)
    if (country) utmParams.set("country", country)

    const fullUrl = utmParams.toString() ? `${baseUrl}?${utmParams.toString()}` : baseUrl

    const shortCode = generateShortCode(8)

    await (supabase as any).from("tracking_links").insert({
      campaign_id: campaignId,
      url: fullUrl,
      short_code: shortCode,
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaignName,
      utm_content: content,
      utm_term: term,
    })

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`

    return NextResponse.json({
      url: fullUrl,
      shortCode,
      shortUrl: `https://${process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, "") || process.env.VERCEL_URL || "localhost:3000"}/api/track/${shortCode}`,
      qrCode: qrCodeUrl,
      utm: { source, medium: medium || "referral", campaign: campaignName, content, term },
    })
  } catch (error) {
    console.error("UTM generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

function generateShortCode(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
