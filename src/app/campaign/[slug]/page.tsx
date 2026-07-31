import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*, offers(*), cpa_networks(*), countries(*), landing_pages(*)")
    .eq("name", slug)
    .single() as any

  if (!campaign || error) {
    notFound()
  }

  const landingPageContent = campaign.landing_pages?.content || ""

  return (
    <html lang="en">
      <body className="m-0 p-0 font-sans">
        <div dangerouslySetInnerHTML={{ __html: landingPageContent }} />
      </body>
    </html>
  )
}
