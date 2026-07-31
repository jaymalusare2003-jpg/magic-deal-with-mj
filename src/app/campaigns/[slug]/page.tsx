import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { CountrySelector } from "@/components/country/country-selector"
import { BlockRenderer } from "@/components/landing-blocks/block-renderer"

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const headersList = await headers()
  const countryHeader = headersList.get("x-vercel-ip-country") || "US"

  const { data: campaign, error } = await (supabase as any)
    .from("campaigns")
    .select("*, offers(*), cpa_networks(*), countries(*), landing_pages(*)")
    .eq("name", slug)
    .single()

  if (!campaign || error) {
    notFound()
  }

  const { data: allCountries } = await (supabase as any)
    .from("countries")
    .select("code, name")
    .eq("active", true) as any

  const countryData = allCountries || [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
  ]

  const content = campaign.landing_pages?.content || { blocks: [] }
  const countryOfferMapping = campaign.country_offer_mapping || {}
  const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "US"
  const detectedCountry = countryHeader

  let selectedCountry = defaultCountry
  if (detectedCountry && countryData.find((c: any) => c.code === detectedCountry)) {
    selectedCountry = detectedCountry
  }

  let countrySpecificContent = content
  if (campaign.landing_pages?.country_specific && campaign.landing_pages.country_specific[selectedCountry]) {
    countrySpecificContent = {
      ...content,
      blocks: campaign.landing_pages.country_specific[selectedCountry].blocks || content.blocks,
    }
  }

  const blocks = countrySpecificContent.blocks || []

  return (
    <html lang="en">
      <head>
        <title>{campaign.landing_pages?.seo?.title || campaign.name} | MAGIC DEAL WITH MJ</title>
        <meta name="description" content={campaign.landing_pages?.seo?.description || campaign.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {campaign.landing_pages?.seo?.keywords && (
          <meta name="keywords" content={campaign.landing_pages.seo.keywords.join(", ")} />
        )}
        {campaign.landing_pages?.seo?.ogImage && (
          <meta property="og:image" content={campaign.landing_pages.seo.ogImage} />
        )}
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <style>{`
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .campaign-wrapper { max-width: 100%; }
        `}</style>
      </head>
      <body className="campaign-wrapper">
        <main>
          {blocks.map((block: any) => (
            <div key={block.id} className="w-full">
              <BlockRenderer block={block} isEditing={false} />
            </div>
          ))}
          {blocks.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No content available for this campaign.</p>
            </div>
          )}
        </main>

        <CountrySelector
          countries={countryData}
          defaultCountry={selectedCountry}
          onCountryChange={(newCountry: string) => {
            window.location.search = `?country=${newCountry}`
          }}
        />

        <script dangerouslySetInnerHTML={{
          __html: `window.currentCountry = "${selectedCountry}";`
        }} />
      </body>
    </html>
  )
}
