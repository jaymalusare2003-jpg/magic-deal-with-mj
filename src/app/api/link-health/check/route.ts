import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, linkIds } = body

    const supabase = await createClient()
    const targets: string[] = urls || []

    if (linkIds) {
      const { data: links } = await (supabase as any)
        .from("link_health")
        .select("target_url")
        .in("id", linkIds) as any
      targets.push(...(links || []).map((l: any) => l.target_url))
    }

    const results: any[] = []

    for (const url of targets) {
      try {
        const startTime = Date.now()
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          redirect: "follow",
        })

        clearTimeout(timeoutId)
        const responseTime = (Date.now() - startTime) / 1000

        let status: "active" | "warning" | "broken" | "expired" | "unknown"
        if (response.status >= 200 && response.status < 400) {
          status = response.status >= 300 ? "warning" : "active"
        } else if (response.status === 403 || response.status === 410) {
          status = "expired"
        } else if (response.status >= 400) {
          status = "broken"
        } else {
          status = "unknown"
        }

        results.push({
          url,
          status,
          httpStatus: response.status,
          responseTime,
          error: null,
        })

        await (supabase as any).from("link_health").upsert({
          target_url: url,
          status,
          http_status: response.status,
          response_time: responseTime,
          last_checked: new Date().toISOString(),
        }, "target_url")
      } catch (error) {
        results.push({
          url,
          status: "broken" as const,
          httpStatus: null,
          responseTime: null,
          error: error instanceof Error ? error.message : "Unknown error",
        })

        await (supabase as any).from("link_health").upsert({
          target_url: url,
          status: "broken",
          error_message: error instanceof Error ? error.message : "Unknown error",
          last_checked: new Date().toISOString(),
        }, "target_url")
      }
    }

    await (supabase as any).from("notifications").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      title: "Link Health Check Complete",
      message: `${results.filter(r => r.status === "broken").length} broken links found out of ${results.length} checked.`,
      type: results.some(r => r.status === "broken") ? "error" : "success",
      read: false,
    })

    return NextResponse.json({ results, checked: results.length })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
