export const SCHEMA_SQL = `-- MAGIC DEAL WITH MJ - Database Schema
-- Run this SQL in your Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  email text not null,
  full_name text,
  role text check (role in ('super_admin', 'admin', 'user')) default 'user',
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- CPA Networks
create table cpa_networks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  website text,
  affiliate_id text,
  api_integration jsonb,
  api_credentials text,
  postback_url text,
  status text check (status in ('active', 'inactive', 'pending')) default 'pending',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon text,
  color text,
  ai_employee_ids text[],
  template_ids text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Countries
create table countries (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  region text,
  language text,
  currency text,
  currency_symbol text,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Offers
create table offers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  cpa_network_id uuid references cpa_networks on delete set null,
  category_id uuid references categories on delete set null,
  description text,
  affiliate_url text not null,
  tracking_url text,
  target_countries text[],
  payout numeric(10,2) default 0,
  currency text default 'USD',
  conversion_type text check (conversion_type in ('cpa', 'cpc', 'cps', 'cpm', 'hybrid')) default 'cpa',
  allowed_traffic text[],
  restricted_traffic text[],
  status text check (status in ('active', 'paused', 'pending', 'expired', 'rejected')) default 'pending',
  start_date date,
  end_date date,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Traffic Sources
create table traffic_sources (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null,
  country text,
  description text,
  settings jsonb,
  active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- AI Employees
create table ai_employees (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  role text not null,
  description text,
  system_instructions text not null,
  editable_prompt text not null,
  ai_model text default 'gpt-4o',
  model_config jsonb,
  enabled boolean default true,
  task_history jsonb,
  output_history jsonb,
  activity_logs jsonb,
  performance_metrics jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Landing Pages
create table landing_pages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  content jsonb not null,
  styles jsonb,
  is_published boolean default false,
  country_specific jsonb,
  created_by uuid references profiles on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Campaigns
create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  offer_id uuid references offers on delete set null,
  cpa_network_id uuid references cpa_networks on delete set null,
  category_id uuid references categories on delete set null,
  country_id uuid references countries on delete set null,
  landing_page_id uuid references landing_pages on delete set null,
  traffic_source_id uuid references traffic_sources on delete set null,
  start_date date,
  end_date date,
  status text check (status in ('draft', 'active', 'paused', 'completed')) default 'draft',
  budget numeric(10,2),
  country_offer_mapping jsonb,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tracking Links
create table tracking_links (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references campaigns on delete cascade,
  url text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  short_code text unique,
  qr_code text,
  clicks integer default 0,
  leads integer default 0,
  conversions integer default 0,
  revenue numeric(10,2) default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Visits
create table visits (
  id uuid primary key default uuid_generate_v4(),
  tracking_link_id uuid references tracking_links on delete cascade,
  ip_hash text,
  country text,
  user_agent text,
  referrer text,
  timestamp timestamp with time zone default now(),
  converted boolean default false
);

-- Analytics Events
create table analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null,
  campaign_id uuid references campaigns,
  offer_id uuid references offers,
  country_id uuid references countries,
  network_id uuid references cpa_networks,
  traffic_source_id uuid references traffic_sources,
  landing_page_id uuid references landing_pages,
  tracking_link_id uuid references tracking_links,
  value numeric(10,2),
  metadata jsonb,
  timestamp timestamp with time zone default now()
);

-- Reports
create table reports (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text check (type in ('daily', 'weekly', 'monthly', 'custom')) not null,
  data jsonb not null,
  generated_by uuid references profiles,
  created_at timestamp with time zone default now()
);

-- Notifications
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles on delete cascade,
  title text not null,
  message text,
  type text check (type in ('info', 'warning', 'error', 'success')) default 'info',
  read boolean default false,
  action_url text,
  created_at timestamp with time zone default now()
);

-- Compliance
create table compliance (
  id uuid primary key default uuid_generate_v4(),
  offer_id uuid references offers on delete cascade,
  email_traffic text check (email_traffic in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  social_traffic text check (social_traffic in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  paid_ads text check (paid_ads in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  search_traffic text check (search_traffic in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  incentivized text check (incentivized in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  direct_linking text check (direct_linking in ('allowed', 'not_allowed', 'unknown')) default 'unknown',
  landing_page_required text check (landing_page_required in ('required', 'not_required', 'unknown')) default 'unknown',
  notes text,
  verified_with_network boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Link Health
create table link_health (
  id uuid primary key default uuid_generate_v4(),
  target_url text not null,
  status text check (status in ('active', 'warning', 'broken', 'expired', 'unknown')) default 'unknown',
  last_checked timestamp with time zone,
  http_status integer,
  response_time numeric(10,2),
  error_message text,
  offer_id uuid references offers,
  campaign_id uuid references campaigns,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- App Settings
create table app_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Audit Logs
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles,
  action text not null,
  table_name text not null,
  record_id text,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone default now()
);

-- Integrations
create table integrations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null,
  config jsonb not null,
  enabled boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table cpa_networks enable row level security;
alter table offers enable row level security;
alter table categories enable row level security;
alter table countries enable row level security;
alter table traffic_sources enable row level security;
alter table ai_employees enable row level security;
alter table landing_pages enable row level security;
alter table campaigns enable row level security;
alter table tracking_links enable row level security;
alter table visits enable row level security;
alter table analytics_events enable row level security;
alter table reports enable row level security;
alter table notifications enable row level security;
alter table compliance enable row level security;
alter table link_health enable row level security;
alter table app_settings enable row level security;
alter table audit_logs enable row level security;
alter table integrations enable row level security;

-- Default RLS policies (admin-only access)
create policy "Allow all for authenticated users" on profiles for all using (true);
create policy "Allow all for authenticated users" on cpa_networks for all using (true);
create policy "Allow all for authenticated users" on offers for all using (true);
create policy "Allow all for authenticated users" on categories for all using (true);
create policy "Allow all for authenticated users" on countries for all using (true);
create policy "Allow all for authenticated users" on traffic_sources for all using (true);
create policy "Allow all for authenticated users" on ai_employees for all using (true);
create policy "Allow all for authenticated users" on landing_pages for all using (true);
create policy "Allow all for authenticated users" on campaigns for all using (true);
create policy "Allow all for authenticated users" on tracking_links for all using (true);
create policy "Allow all for authenticated users" on visits for all using (true);
create policy "Allow all for authenticated users" on analytics_events for all using (true);
create policy "Allow all for authenticated users" on reports for all using (true);
create policy "Allow all for authenticated users" on notifications for all using (true);
create policy "Allow all for authenticated users" on compliance for all using (true);
create policy "Allow all for authenticated users" on link_health for all using (true);
create policy "Allow all for authenticated users" on app_settings for all using (true);
create policy "Allow all for authenticated users" on audit_logs for all using (true);
create policy "Allow all for authenticated users" on integrations for all using (true);

-- Triggers for updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger update_cpa_networks_updated_at before update on cpa_networks for each row execute function update_updated_at();
create trigger update_offers_updated_at before update on offers for each row execute function update_updated_at();
create trigger update_categories_updated_at before update on categories for each row execute function update_updated_at();
create trigger update_countries_updated_at before update on countries for each row execute function update_updated_at();
create trigger update_traffic_sources_updated_at before update on traffic_sources for each row execute function update_updated_at();
create trigger update_ai_employees_updated_at before update on ai_employees for each row execute function update_updated_at();
create trigger update_landing_pages_updated_at before update on landing_pages for each row execute function update_updated_at();
create trigger update_campaigns_updated_at before update on campaigns for each row execute function update_updated_at();
create trigger update_tracking_links_updated_at before update on tracking_links for each row execute function update_updated_at();
create trigger update_compliance_updated_at before update on compliance for each row execute function update_updated_at();
create trigger update_link_health_updated_at before update on link_health for each row execute function update_updated_at();
create trigger update_app_settings_updated_at before update on app_settings for each row execute function update_updated_at();
create trigger update_integrations_updated_at before update on integrations for each row execute function update_updated_at();

-- Insert default data
insert into countries (code, name, region, language, currency, currency_symbol) values
  ('US', 'United States', 'North America', 'en', 'USD', '$'),
  ('GB', 'United Kingdom', 'Europe', 'en', 'GBP', '£'),
  ('CA', 'Canada', 'North America', 'en', 'CAD', '$'),
  ('AU', 'Australia', 'Oceania', 'en', 'AUD', '$'),
  ('DE', 'Germany', 'Europe', 'de', 'EUR', '€'),
  ('FR', 'France', 'Europe', 'fr', 'EUR', '€'),
  ('IN', 'India', 'Asia', 'en', 'INR', '₹'),
  ('BR', 'Brazil', 'South America', 'pt', 'BRL', 'R$');

insert into categories (name, description, icon, color) values
  ('Jobs', 'Employment and job-related offers', '💼', '#3b82f6'),
  ('App Install', 'Mobile app installation offers', '📱', '#10b981'),
  ('Finance', 'Financial services and products', '💰', '#f59e0b'),
  ('Surveys', 'Survey and market research offers', '📋', '#8b5cf6'),
  ('Education', 'Educational courses and training', '📚', '#ef4444'),
  ('Software', 'Software and subscription services', '💻', '#06b6d4'),
  ('AI Tools', 'Artificial intelligence tools and services', '🤖', '#ec4899'),
  ('Health', 'Health and wellness products', '🩺', '#22c55e'),
  ('E-commerce', 'E-commerce and shopping offers', '🛍️', '#f97316'),
  ('Sweepstakes', 'Contest and sweepstakes entries', '🎁', '#a855f7'),
  ('Other', 'Other categories', '📦', '#9ca3af');

-- Default CPA Network entries
insert into cpa_networks (name, logo_url, website, status, notes) values
  ('AdsBlueMedia', '/images/networks/adsbluemedia.png', 'https://adsbluemedia.com', 'active', 'Official API integration ready'),
  ('CPAGrip', '/images/networks/cpagrip.png', 'https://cpagrip.com', 'active', 'Official API integration ready'),
  ('ClickDealer', '/images/networks/clickdealer.png', 'https://clickdealer.com', 'active', 'API integration supported'),
  ('AdWorkMedia', '/images/networks/adworkmedia.png', 'https://adworkmedia.com', 'active', 'API integration supported');

-- Default AI Employees
insert into ai_employees (name, icon, role, description, system_instructions, editable_prompt, ai_model, enabled) values
  ('AI Manager', '👨‍💼', 'ai-manager', 'Coordinates all AI employees and delegates campaign tasks', 'You are the AI Manager. You coordinate all AI employee agents and delegate tasks based on the admin''s campaign requests. Prioritize tasks, manage dependencies, and produce a consolidated report.', 'Based on the admin''s request, coordinate the AI team to complete the campaign workflow from offer research to analytics reporting.', 'gpt-4o', true),
  ('AI Offer Researcher', '🔍', 'offer-researcher', 'Analyzes CPA offers, identifies categories, payouts, conversion types, and target countries', 'You are the AI Offer Researcher. Analyze CPA offers by reviewing the offer details, identifying the correct category, analyzing payout structures, conversion types, target countries, offer requirements, allowed/restricted traffic, and generating a comprehensive offer summary with potential risks.', 'Analyze the following CPA offer and provide a detailed breakdown: category, payout analysis, conversion type, target countries, offer requirements, allowed and restricted traffic, summary, and potential risks.', 'gpt-4o', true),
  ('AI Traffic Researcher', '🚦', 'traffic-researcher', 'Researches public traffic opportunities, SEO, communities, and advertising channels', 'You are the AI Traffic Researcher. Research relevant public traffic opportunities, find SEO opportunities, identify relevant public websites and communities, find approved advertising opportunities, identify keyword opportunities, score traffic opportunities, and recommend traffic strategies. Only use public, lawful and platform-compliant opportunities.', 'Research traffic opportunities for the given campaign: SEO opportunities, public websites, relevant communities, approved advertising channels, keyword opportunities. Score and recommend strategies.', 'gpt-4o', true),
  ('AI Audience Researcher', '🎯', 'audience-researcher', 'Identifies target audiences, search intent, and audience segments by country', 'You are the AI Audience Researcher. Identify target audiences, analyze search intent, generate audience segments, identify interests, and conduct country-specific audience research.', 'For the given offer and country, identify the target audience, analyze search intent, generate audience segments, and identify audience interests.', 'gpt-4o', true),
  ('AI SEO Employee', '🔗', 'seo-employee', 'Performs keyword research, SEO strategy, meta tags, content clusters, and internal linking', 'You are the AI SEO Employee. Conduct keyword research, develop SEO strategies, create SEO titles and meta descriptions, generate blog topics and content clusters, suggest internal linking strategies, and perform country-specific SEO analysis.', 'For the given keyword and country, perform keyword research, develop an SEO strategy, generate SEO titles, meta descriptions, blog topics, content clusters, and internal linking suggestions.', 'gpt-4o', true),
  ('AI Content Employee', '✍️', 'content-employee', 'Generates blog posts, SEO articles, social media posts, ad copy, and promotional content', 'You are the AI Content Employee. Generate blog posts, SEO articles, social media posts, Pinterest content, YouTube titles and descriptions, promotional content, ad copy, and CTA variations in multiple languages.', 'Generate content for the given topic and country: blog post, SEO article, social media post, ad copy, and CTA variations in the specified language.', 'gpt-4o', true),
  ('AI Landing Page Employee', '🎨', 'landing-page-employee', 'Generates landing pages, headlines, CTAs, FAQ, trust sections, and country-specific copy', 'You are the AI Landing Page Employee. Generate landing pages with headlines, subheadlines, benefits, CTAs, FAQ sections, trust sections, SEO metadata, and country-specific copy.', 'Generate a landing page structure for the given offer and country: headlines, subheadlines, benefits, CTA, FAQ, trust sections, SEO metadata, and country-specific copy.', 'gpt-4o', true),
  ('AI Campaign Employee', '📊', 'campaign-employee', 'Develops campaign strategy, traffic strategy, checklists, ad copy, and tracking', 'You are the AI Campaign Employee. Develop campaign strategies, traffic strategies, campaign checklists, ad copy, creative concepts, and campaign tracking setups.', 'Develop a complete campaign strategy for the given offer: traffic strategy, campaign checklist, ad copy, creative concepts, and tracking setup.', 'gpt-4o', true),
  ('AI Analytics Employee', '📈', 'analytics-employee', 'Analyzes visitors, clicks, leads, conversions, EPC, revenue, and performance by country', 'You are the AI Analytics Employee. Analyze visitors, clicks, leads, conversions, conversion rates, EPC, commissions, revenue, and performance by country, offer, network, traffic source, and landing page.', 'Analyze the given analytics data and provide insights on visitors, clicks, leads, conversions, conversion rates, EPC, revenue, and performance breakdowns.', 'gpt-4o', true),
  ('AI CRO Employee', '🧪', 'cro-employee', 'Analyzes CTR, landing page performance, A/B testing, and optimization recommendations', 'You are the AI CRO Employee. Analyze CTR, landing page performance, conversion rates, CTA performance, and content performance. Recommend A/B testing, CTA changes, layout improvements, and content improvements.', 'Analyze the given campaign performance data for CRO opportunities: CTR analysis, landing page performance, CTA performance. Recommend A/B tests and optimizations.', 'gpt-4o', true),
  ('AI Compliance Employee', '⚖️', 'compliance-employee', 'Checks traffic rules, compliance requirements, and regulatory guidelines', 'You are the AI Compliance Employee. Check allowed and restricted traffic types, email/social/paid/search traffic rules, incentive traffic policies, direct linking policies, and landing page requirements. Mark unknown rules as "Verify with CPA network before launching."', 'Check compliance for the given offer: email traffic, social traffic, paid ads, search traffic, incentivized traffic, direct linking, landing page requirements. Mark unknown rules as "Verify with CPA network before launching."'  , 'gpt-4o', true);

-- Default app settings
insert into app_settings (key, value, description) values
  ('app_name', '"MAGIC DEAL WITH MJ"', 'Application name'),
  ('app_description', '"AI-Powered CPA Affiliate Marketing Management Platform"', 'Application description'),
  ('auto_update', 'true', 'Enable automatic updates'),
  ('auto_routing', 'true', 'Enable automatic country-based routing'),
  ('auto_offer_replacement', 'false', 'Enable automatic offer replacement'),
  ('auto_optimization', 'false', 'Enable automatic campaign optimization'),
  ('ai_recommendations', 'true', 'Enable AI recommendations'),
  ('default_country', '"US"', 'Default country code'),
  ('default_currency', '"USD"', 'Default currency');
`;
