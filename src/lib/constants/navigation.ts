import { NavItem } from '@/lib/db/types'

export const navigation: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { title: 'AI Employees', href: '/admin/ai-employees', icon: 'Brain' },
  { title: 'CPA Networks', href: '/admin/cpa-networks', icon: 'Network' },
  { title: 'Offers', href: '/admin/offers', icon: 'Gift' },
  { title: 'Categories', href: '/admin/categories', icon: 'Tag' },
  { title: 'Countries', href: '/admin/countries', icon: 'Globe' },
  { title: 'Traffic Research', href: '/admin/traffic-research', icon: 'Search' },
  { title: 'Landing Pages', href: '/admin/landing-pages', icon: 'FileText' },
  { title: 'Content Studio', href: '/admin/content-studio', icon: 'Edit3' },
  { title: 'Campaigns', href: '/admin/campaigns', icon: 'Target' },
  { title: 'Analytics', href: '/admin/analytics', icon: 'BarChart3' },
  { title: 'Reports', href: '/admin/reports', icon: 'FileText' },
  { title: 'Compliance', href: '/admin/compliance', icon: 'Shield' },
  { title: 'Link Health', href: '/admin/link-health', icon: 'Activity' },
  { title: 'Integrations', href: '/admin/integrations', icon: 'Plug' },
  { title: 'Notifications', href: '/admin/notifications', icon: 'Bell' },
  { title: 'Admin Settings', href: '/admin/settings', icon: 'Settings' },
]

export const AI_EMPLOYEES = [
  { id: 'ai-manager', name: 'AI Manager', role: 'Coordinates all AI employees', icon: '👨‍💼' },
  { id: 'offer-researcher', name: 'AI Offer Researcher', role: 'Analyzes CPA offers', icon: '🔍' },
  { id: 'traffic-researcher', name: 'AI Traffic Researcher', role: 'Researches traffic opportunities', icon: '🚦' },
  { id: 'audience-researcher', name: 'AI Audience Researcher', role: 'Identifies target audiences', icon: '🎯' },
  { id: 'seo-employee', name: 'AI SEO Employee', role: 'Keyword research & SEO strategy', icon: '🔗' },
  { id: 'content-employee', name: 'AI Content Employee', role: 'Generates content', icon: '✍️' },
  { id: 'landing-page-employee', name: 'AI Landing Page Employee', role: 'Generates landing pages', icon: '🎨' },
  { id: 'campaign-employee', name: 'AI Campaign Employee', role: 'Campaign strategy', icon: '📊' },
  { id: 'analytics-employee', name: 'AI Analytics Employee', role: 'Analyzes performance', icon: '📈' },
  { id: 'cro-employee', name: 'AI CRO Employee', role: 'Conversion optimization', icon: '🧪' },
  { id: 'compliance-employee', name: 'AI Compliance Employee', role: 'Compliance checks', icon: '⚖️' },
]
