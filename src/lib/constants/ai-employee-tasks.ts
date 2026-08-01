export const AI_EMPLOYEE_TASKS: Record<string, Array<{ value: string; label: string; description: string }>> = {
  "ai-manager": [
    { value: "campaign-planning", label: "Campaign Planning", description: "Develop a complete campaign plan" },
    { value: "delegate-workflow", label: "Delegate Campaign Workflow", description: "Coordinate all AI employees for a campaign" },
    { value: "campaign-strategy", label: "Campaign Strategy", description: "Develop campaign strategy and tactics" },
    { value: "coordination", label: "AI Employee Coordination", description: "Coordinate between multiple AI employees" },
    { value: "executive-summary", label: "Executive Summary", description: "Generate a consolidated executive summary" },
  ],
  "offer-researcher": [
    { value: "analyze-offer", label: "Analyze Offer", description: "Full analysis of a CPA offer" },
    { value: "analyze-payout", label: "Analyze Payout", description: "Analyze payout structure and potential" },
    { value: "analyze-conversion", label: "Analyze Conversion Type", description: "Analyze conversion type and metrics" },
    { value: "analyze-countries", label: "Analyze Target Countries", description: "Analyze target countries and geo performance" },
    { value: "analyze-traffic", label: "Analyze Allowed/Restricted Traffic", description: "Analyze traffic rules and restrictions" },
    { value: "generate-summary", label: "Generate Offer Summary", description: "Generate a comprehensive offer summary" },
    { value: "identify-risks", label: "Identify Potential Risks", description: "Identify potential risks and red flags" },
  ],
  "traffic-researcher": [
    { value: "traffic-strategy", label: "Traffic Strategy", description: "Develop a traffic strategy for offers" },
    { value: "seo-opportunities", label: "SEO Opportunities", description: "Find SEO keyword and content opportunities" },
    { value: "public-traffic", label: "Public Traffic Opportunities", description: "Research public, lawful traffic sources" },
    { value: "content-opportunities", label: "Content Opportunities", description: "Find content marketing opportunities" },
    { value: "search-opportunities", label: "Search Opportunities", description: "Find search keyword opportunities" },
    { value: "evaluate-sources", label: "Traffic Source Evaluation", description: "Evaluate and score traffic sources" },
  ],
  "audience-researcher": [
    { value: "audience-analysis", label: "Audience Analysis", description: "Analyze target audience demographics" },
    { value: "audience-segments", label: "Audience Segments", description: "Generate audience segment definitions" },
    { value: "search-intent", label: "Search Intent", description: "Analyze search intent for keywords" },
    { value: "interests", label: "Interests", description: "Identify audience interests and behaviors" },
    { value: "country-audience", label: "Country-Specific Audience", description: "Research audience in specific countries" },
    { value: "persona-research", label: "Persona Research", description: "Create detailed audience personas" },
  ],
  "seo-employee": [
    { value: "keyword-strategy", label: "Keyword Strategy", description: "Develop a keyword targeting strategy" },
    { value: "seo-title", label: "SEO Title", description: "Generate optimized SEO page titles" },
    { value: "meta-description", label: "Meta Description", description: "Generate compelling meta descriptions" },
    { value: "blog-topics", label: "Blog Topics", description: "Generate blog post topic ideas" },
    { value: "content-cluster", label: "Content Cluster", description: "Plan a content cluster around a topic" },
    { value: "internal-linking", label: "Internal Linking", description: "Suggest internal linking strategies" },
    { value: "country-seo", label: "Country SEO Strategy", description: "Develop SEO strategy for a specific country" },
  ],
  "content-employee": [
    { value: "blog-post", label: "Blog Post", description: "Generate a full blog post" },
    { value: "seo-article", label: "SEO Article", description: "Generate an SEO-optimized article" },
    { value: "social-post", label: "Social Media Post", description: "Generate social media content" },
    { value: "pinterest", label: "Pinterest Content", description: "Generate Pinterest pin title and description" },
    { value: "youtube-title", label: "YouTube Title", description: "Generate YouTube video title" },
    { value: "youtube-description", label: "YouTube Description", description: "Generate YouTube video description" },
    { value: "ad-copy", label: "Ad Copy", description: "Generate advertising copy variations" },
    { value: "cta-variations", label: "CTA Variations", description: "Generate call-to-action variations" },
  ],
  "landing-page-employee": [
    { value: "headline", label: "Generate Headline", description: "Generate compelling headlines" },
    { value: "subheadline", label: "Generate Subheadline", description: "Generate supporting subheadlines" },
    { value: "benefits", label: "Generate Benefits", description: "List product/service benefits" },
    { value: "cta", label: "Generate CTA", description: "Generate call-to-action text" },
    { value: "faq", label: "Generate FAQ", description: "Generate FAQ section content" },
    { value: "trust-section", label: "Generate Trust Section", description: "Generate trust-building elements" },
    { value: "seo-metadata", label: "Generate SEO Metadata", description: "Generate SEO title and meta description" },
    { value: "country-copy", label: "Generate Country-Specific Copy", description: "Generate localized copy for a country" },
  ],
  "campaign-employee": [
    { value: "campaign-strategy", label: "Campaign Strategy", description: "Develop a full campaign strategy" },
    { value: "traffic-strategy", label: "Traffic Strategy", description: "Plan traffic sourcing and allocation" },
    { value: "checklist", label: "Campaign Checklist", description: "Generate a campaign launch checklist" },
    { value: "ad-copy", label: "Ad Copy", description: "Generate ad copy variations" },
    { value: "creative-concepts", label: "Creative Concepts", description: "Generate creative concept ideas" },
    { value: "tracking-plan", label: "Tracking Plan", description: "Set up campaign tracking and attribution" },
  ],
  "analytics-employee": [
    { value: "campaign-data", label: "Analyze Campaign Data", description: "Analyze campaign performance data" },
    { value: "offer-performance", label: "Analyze Offer Performance", description: "Analyze individual offer metrics" },
    { value: "country-performance", label: "Analyze Country Performance", description: "Break down performance by country" },
    { value: "traffic-source", label: "Analyze Traffic Source", description: "Analyze performance by traffic source" },
    { value: "landing-page", label: "Analyze Landing Page", description: "Analyze landing page conversion performance" },
    { value: "identify-trends", label: "Identify Trends", description: "Identify performance trends and patterns" },
  ],
  "cro-employee": [
    { value: "ctr-analysis", label: "CTR Analysis", description: "Analyze click-through rates" },
    { value: "landing-page-analysis", label: "Landing Page Analysis", description: "Analyze landing page for improvements" },
    { value: "cta-analysis", label: "CTA Analysis", description: "Analyze call-to-action performance" },
    { value: "conversion-optimization", label: "Conversion Optimization", description: "Recommend conversion improvements" },
    { value: "ab-tests", label: "A/B Test Recommendations", description: "Suggest A/B testing opportunities" },
  ],
  "compliance-employee": [
    { value: "traffic-compliance", label: "Traffic Compliance Check", description: "Check traffic type compliance" },
    { value: "offer-compliance", label: "Offer Compliance Check", description: "Check offer traffic rules" },
    { value: "direct-linking", label: "Direct Linking Check", description: "Check direct linking policy" },
    { value: "paid-traffic", label: "Paid Traffic Check", description: "Check paid advertising compliance" },
    { value: "social-traffic", label: "Social Traffic Check", description: "Check social media traffic rules" },
    { value: "email-traffic", label: "Email Traffic Check", description: "Check email marketing compliance" },
    { value: "incentive-traffic", label: "Incentive Traffic Check", description: "Check incentivized traffic rules" },
    { value: "landing-page-required", label: "Landing Page Requirement Check", description: "Check landing page requirements" },
  ],
}

export function getTasksForRole(role: string): Array<{ value: string; label: string; description: string }> {
  return AI_EMPLOYEE_TASKS[role] || []
}

export function getEmployeeIcon(role: string): string {
  const icons: Record<string, string> = {
    "ai-manager": "👨‍💼",
    "offer-researcher": "🔍",
    "traffic-researcher": "🚦",
    "audience-researcher": "🎯",
    "seo-employee": "🔗",
    "content-employee": "✍️",
    "landing-page-employee": "🎨",
    "campaign-employee": "📊",
    "analytics-employee": "📈",
    "cro-employee": "🧪",
    "compliance-employee": "⚖️",
  }
  return icons[role] || "🤖"
}
