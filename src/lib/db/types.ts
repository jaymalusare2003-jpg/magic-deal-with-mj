export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          role: 'super_admin' | 'admin' | 'user'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'user'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'user'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cpa_networks: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website: string | null
          affiliate_id: string | null
          api_integration: Json | null
          api_credentials: string | null
          postback_url: string | null
          status: 'active' | 'inactive' | 'pending'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["cpa_networks"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["cpa_networks"]["Row"]>
      }
      offers: {
        Row: {
          id: string
          name: string
          cpa_network_id: string
          category_id: string
          description: string | null
          affiliate_url: string
          tracking_url: string | null
          target_countries: string[]
          payout: number
          currency: string
          conversion_type: 'cpa' | 'cpc' | 'cps' | 'cpm' | 'hybrid'
          allowed_traffic: string[] | null
          restricted_traffic: string[] | null
          status: 'active' | 'paused' | 'pending' | 'expired' | 'rejected'
          start_date: string | null
          end_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["offers"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["offers"]["Row"]>
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          ai_employee_ids: string[] | null
          template_ids: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>
      }
      countries: {
        Row: {
          id: string
          code: string
          name: string
          region: string | null
          language: string | null
          currency: string | null
          currency_symbol: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["countries"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["countries"]["Row"]>
      }
      traffic_sources: {
        Row: {
          id: string
          name: string
          type: string
          country: string | null
          description: string | null
          settings: Json | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["traffic_sources"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["traffic_sources"]["Row"]>
      }
      ai_employees: {
        Row: {
          id: string
          name: string
          icon: string | null
          role: string
          description: string | null
          system_instructions: string
          editable_prompt: string
          ai_model: string
          model_config: Json | null
          enabled: boolean
          task_history: Json | null
          output_history: Json | null
          activity_logs: Json | null
          performance_metrics: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["ai_employees"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["ai_employees"]["Row"]>
      }
      landing_pages: {
        Row: {
          id: string
          name: string
          slug: string
          content: Json
          styles: Json | null
          is_published: boolean
          country_specific: Json | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["landing_pages"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["landing_pages"]["Row"]>
      }
      campaigns: {
        Row: {
          id: string
          name: string
          offer_id: string
          cpa_network_id: string
          category_id: string
          country_id: string
          landing_page_id: string | null
          traffic_source_id: string | null
          start_date: string | null
          end_date: string | null
          status: 'draft' | 'active' | 'paused' | 'completed'
          budget: number | null
          country_offer_mapping: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["campaigns"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["campaigns"]["Row"]>
      }
      tracking_links: {
        Row: {
          id: string
          campaign_id: string
          url: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_term: string | null
          short_code: string | null
          qr_code: string | null
          clicks: number
          leads: number
          conversions: number
          revenue: number | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["tracking_links"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["tracking_links"]["Row"]>
      }
      visits: {
        Row: {
          id: string
          tracking_link_id: string
          ip_hash: string
          country: string | null
          user_agent: string | null
          referrer: string | null
          timestamp: string
          converted: boolean
        }
        Insert: Partial<Database["public"]["Tables"]["visits"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["visits"]["Row"]>
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          campaign_id: string | null
          offer_id: string | null
          country_id: string | null
          network_id: string | null
          traffic_source_id: string | null
          landing_page_id: string | null
          tracking_link_id: string | null
          value: number | null
          metadata: Json | null
          timestamp: string
        }
        Insert: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>
      }
      reports: {
        Row: {
          id: string
          title: string
          type: 'daily' | 'weekly' | 'monthly' | 'custom'
          data: Json
          generated_by: string
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["reports"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'warning' | 'error' | 'success'
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>
      }
      compliance: {
        Row: {
          id: string
          offer_id: string
          email_traffic: 'allowed' | 'not_allowed' | 'unknown'
          social_traffic: 'allowed' | 'not_allowed' | 'unknown'
          paid_ads: 'allowed' | 'not_allowed' | 'unknown'
          search_traffic: 'allowed' | 'not_allowed' | 'unknown'
          incentivized: 'allowed' | 'not_allowed' | 'unknown'
          direct_linking: 'allowed' | 'not_allowed' | 'unknown'
          landing_page_required: 'required' | 'not_required' | 'unknown'
          notes: string | null
          verified_with_network: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["compliance"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["compliance"]["Row"]>
      }
      link_health: {
        Row: {
          id: string
          target_url: string
          status: 'active' | 'warning' | 'broken' | 'expired' | 'unknown'
          last_checked: string | null
          http_status: number | null
          response_time: number | null
          error_message: string | null
          offer_id: string | null
          campaign_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["link_health"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["link_health"]["Row"]>
      }
      app_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["app_settings"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["app_settings"]["Row"]>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Row"]>
      }
      integrations: {
        Row: {
          id: string
          name: string
          type: string
          config: Json
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["integrations"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["integrations"]["Row"]>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CpaNetwork = Database['public']['Tables']['cpa_networks']['Row']
export type Offer = Database['public']['Tables']['offers']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Country = Database['public']['Tables']['countries']['Row']
export type TrafficSource = Database['public']['Tables']['traffic_sources']['Row']
export type AiEmployee = Database['public']['Tables']['ai_employees']['Row']
export type LandingPage = Database['public']['Tables']['landing_pages']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type TrackingLink = Database['public']['Tables']['tracking_links']['Row']
export type Visit = Database['public']['Tables']['visits']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Compliance = Database['public']['Tables']['compliance']['Row']
export type LinkHealth = Database['public']['Tables']['link_health']['Row']
export type AppSetting = Database['public']['Tables']['app_settings']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type Integration = Database['public']['Tables']['integrations']['Row']

// AI Employee workflow types
export interface AiWorkflowStep {
  employeeId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result: string | null
  startedAt: string | null
  completedAt: string | null
}

export interface AiCampaignWorkflow {
  id: string
  offerId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  steps: AiWorkflowStep[]
  finalReport: string | null
  createdAt: string
  updatedAt: string
}

// Landing page content types
export type BlockType =
  | 'text'
  | 'heading'
  | 'subheading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'button'
  | 'cta'
  | 'affiliate-link'
  | 'divider'
  | 'spacer'
  | 'faq'
  | 'testimonial'
  | 'feature-cards'
  | 'benefits'
  | 'pricing'
  | 'social-icons'
  | 'embed'
  | 'custom-html'

export interface BaseBlock {
  id: string
  type: BlockType
  styles?: Record<string, string>
}

export interface TextBlock extends BaseBlock {
  type: 'text' | 'heading' | 'subheading' | 'paragraph'
  content: string
  align?: 'left' | 'center' | 'right'
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  src: string
  alt?: string
  title?: string
  caption?: string
  align?: 'left' | 'center' | 'right'
  width?: number
  height?: number
  borderRadius?: number
  spacing?: number
}

export interface VideoBlock extends BaseBlock {
  type: 'video'
  url: string
  thumbnail?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
}

export interface ButtonBlock extends BaseBlock {
  type: 'button' | 'cta'
  text: string
  linkType: 'affiliate' | 'external' | 'internal'
  url: string
  openInNewTab?: boolean
  nofollow?: boolean
  sponsored?: boolean
  utm?: Record<string, string>
}

export interface LinkBlock extends BaseBlock {
  type: 'affiliate-link'
  url: string
  text: string
  openInNewTab?: boolean
  nofollow?: boolean
  utm?: Record<string, string>
}

export interface HtmlBlock extends BaseBlock {
  type: 'custom-html'
  content: string
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed'
  url: string
  responsive?: boolean
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer'
  height?: number
}

export interface FaqBlock extends BaseBlock {
  type: 'faq'
  items: Array<{ question: string; answer: string }>
}

export interface TestimonialBlock extends BaseBlock {
  type: 'testimonial'
  items: Array<{
    name: string
    title: string
    quote: string
    avatar?: string
  }>
}

export interface FeatureCard {
  title: string
  description: string
  icon?: string
  image?: string
}

export interface FeatureCardsBlock extends BaseBlock {
  type: 'feature-cards'
  items: FeatureCard[]
  columns?: number
}

export interface Benefit {
  title: string
  description: string
  icon?: string
}

export interface BenefitsBlock extends BaseBlock {
  type: 'benefits'
  items: Benefit[]
}

export interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  ctaText?: string
  ctaLink?: string
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing'
  tiers: PricingTier[]
}

export interface SocialIcon {
  platform: string
  url: string
}

export interface SocialIconsBlock extends BaseBlock {
  type: 'social-icons'
  items: SocialIcon[]
  style?: 'simple' | 'colored' | 'outline'
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | LinkBlock
  | HtmlBlock
  | EmbedBlock
  | DividerBlock
  | SpacerBlock
  | FaqBlock
  | TestimonialBlock
  | FeatureCardsBlock
  | BenefitsBlock
  | PricingBlock
  | SocialIconsBlock

export interface LandingPageContent {
  blocks: ContentBlock[]
  styles?: Record<string, any>
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
}

// Navigation
export interface NavItem {
  title: string
  href: string
  icon: string
  children?: NavItem[]
}
