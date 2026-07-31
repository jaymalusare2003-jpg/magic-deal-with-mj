import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from("campaigns")
    .select(`
      *,
      offers (*),
      cpa_networks (*),
      countries (*),
      landing_pages (*),
      tracking_links (*)
    `)
    .eq("name", slug)
    .single()

  if (!campaign) {
    notFound()
  }

  return (
    <html lang="en">
      <body className="m-0 p-0 font-sans">
        <div dangerouslySetInnerHTML={{ __html: campaign.landing_pages?.content }} />
      </body>
    </html>
  )
}
