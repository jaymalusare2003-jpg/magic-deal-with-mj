import { createClient } from "@/lib/supabase/server"
import { callAIEmployee } from "@/lib/ai/openai-client"
import { NextRequest, NextResponse } from "next/server"

const WORKFLOW_STEPS = [
  { id: "1", name: "AI Offer Researcher", employee: "AI Offer Researcher", next: "2" },
  { id: "2", name: "AI Compliance Employee", employee: "AI Compliance Employee", next: "3" },
  { id: "3", name: "AI Audience Researcher", employee: "AI Audience Researcher", next: "4" },
  { id: "4", name: "AI Traffic Researcher", employee: "AI Traffic Researcher", next: "5" },
  { id: "5", name: "AI SEO Employee", employee: "AI SEO Employee", next: "6" },
  { id: "6", name: "AI Content Employee", employee: "AI Content Employee", next: "7" },
  { id: "7", name: "AI Landing Page Employee", employee: "AI Landing Page Employee", next: "8" },
  { id: "8", name: "AI Campaign Employee", employee: "AI Campaign Employee", next: "9" },
  { id: "9", name: "AI Analytics Employee", employee: "AI Analytics Employee", next: "10" },
  { id: "10", name: "AI CRO Employee", employee: "AI CRO Employee", next: "11" },
  { id: "11", name: "AI Manager", employee: "AI Manager", next: null },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { offerId, campaignId } = body

    if (!offerId) {
      return NextResponse.json({ error: "offerId is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: offer, error: offerError } = await supabase
      .from("offers")
      .select("*, cpa_networks(*), categories(*), countries(*)")
      .eq("id", offerId)
      .single() as any

    if (offerError || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    const { data: employees } = await supabase.from("ai_employees").select("*") as any
    const employeeMap = (employees || []).reduce((map: any, emp: any) => {
      map[emp.name] = emp
      return map
    }, {})

    const stepResults: Record<string, any> = {}
    const workflowId = `workflow_${Date.now()}`

    for (const step of WORKFLOW_STEPS) {
      const employee = employeeMap[step.employee]
      if (!employee || !employee.enabled) {
        stepResults[step.id] = {
          status: "skipped",
          result: "Employee not found or disabled",
          timestamp: new Date().toISOString(),
        }
        continue
      }

      stepResults[step.id] = {
        status: "running",
        timestamp: new Date().toISOString(),
      }

      const previousResults = Object.keys(stepResults)
        .filter(k => k < step.id)
        .map(k => stepResults[k])
        .filter(r => r.status === "completed")
        .map(r => r.result)
        .join("\n\n")

      let prompt = ""
      switch (step.id) {
        case "1":
          prompt = `Analyze this CPA offer: ${JSON.stringify(offer)}. Provide category, payout analysis, conversion type, target countries, requirements, allowed/restricted traffic, and risks.`
          break
        case "2":
          prompt = `Check compliance for this offer: ${JSON.stringify(offer)}. Check email traffic, social traffic, paid ads, search traffic, incentivized, direct linking, landing page requirements. Mark unknown rules as "Verify with CPA network before launching." Previous research: ${previousResults}`
          break
        case "3":
          prompt = `Identify target audience for this offer: ${offer.name} (${offer.description}). Analyze search intent, generate audience segments, identify interests. For each target country.`
          break
        case "4":
          prompt = `Research traffic opportunities for this offer: ${offer.name}. Find SEO opportunities, public websites, communities, approved advertising channels, keyword opportunities. Score and recommend strategies.`
          break
        case "5":
          prompt = `Perform keyword research and SEO strategy for: ${offer.name}. Generate SEO titles, meta descriptions, blog topics, content clusters, internal linking suggestions. Country: ${offer.target_countries?.join(", ") || "US"}.`
          break
        case "6":
          prompt = `Generate content for: ${offer.name} in ${offer.target_countries?.join(", ") || "US"}. Create: blog post, SEO article, social media posts, Pinterest content, YouTube title/description, ad copy, CTA variations.`
          break
        case "7":
          prompt = `Generate a landing page structure for: ${offer.name}. Include: headlines, subheadlines, benefits, CTA, FAQ, trust sections, SEO metadata, country-specific copy for ${offer.target_countries?.join(", ") || "US"}.`
          break
        case "8":
          prompt = `Develop a campaign strategy for: ${offer.name}. Include: traffic strategy, campaign checklist, ad copy concepts, creative concepts, tracking setup. Previous research: ${previousResults}`
          break
        case "9":
          prompt = `Analyze how you would track and measure this campaign: ${offer.name}. Define KPIs: visitors, clicks, leads, conversions, conversion rate, EPC, commission. Recommend tracking methods.`
          break
        case "10":
          prompt = `Analyze the landing page and campaign for CRO opportunities: ${offer.name}. Check CTR, landing page performance, conversion rate, CTA performance. Recommend A/B tests and optimizations.`
          break
        case "11":
          prompt = `Compile AI Manager Report for campaign based on offer: ${offer.name}. Include executive summary, top performers, opportunities, risks, recommendations. Previous findings: ${previousResults}`
          break
      }

      try {
        const result = await callAIEmployee(
          employee.system_instructions,
          prompt,
          employee.ai_model,
          employee.model_config?.temperature || 0.7,
          employee.model_config?.max_tokens || 4000
        )

        stepResults[step.id] = {
          status: "completed",
          result,
          startedAt: stepResults[step.id]?.timestamp,
          completedAt: new Date().toISOString(),
        }

        await (supabase as any).from("notifications").insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          title: `Workflow Step Completed`,
          message: `${step.name} finished processing.`,
          type: "info",
          read: false,
        }) as any

      } catch (stepError) {
        stepResults[step.id] = {
          status: "failed",
          error: stepError instanceof Error ? stepError.message : "Unknown error",
          completedAt: new Date().toISOString(),
        }
      }
    }

    const { data: report } = await (supabase as any).from("reports").insert({
      title: `AI Campaign Workflow Report - ${offer.name}`,
      type: "custom",
      data: stepResults,
      generated_by: (await supabase.auth.getUser()).data.user?.id,
    }) as any

    return NextResponse.json({
      workflowId,
      offer: offer.name,
      steps: WORKFLOW_STEPS,
      results: stepResults,
      reportId: report?.id,
      completed: true,
    })
  } catch (error) {
    console.error("Workflow error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workflowId = searchParams.get("workflowId")

  if (!workflowId) {
    return NextResponse.json({ steps: WORKFLOW_STEPS })
  }

  return NextResponse.json({ steps: WORKFLOW_STEPS, workflowId })
}
