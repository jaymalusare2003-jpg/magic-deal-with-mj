import Link from "next/link"
import { ArrowRight, Brain, Target, TrendingUp, Shield, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">MAGIC DEAL WITH MJ</span>
          </div>
          <Link href="/login">
            <Button>Admin Login</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI-Powered CPA Affiliate Marketing OS
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete AI-powered command center for CPA affiliate marketers.
            Manage networks, offers, campaigns, landing pages, and analytics all in one place.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              Access Admin Panel
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border rounded-xl p-8 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Employees</h3>
            <p className="text-muted-foreground">11 specialized AI agents automate offer research, SEO, content, and analytics.</p>
          </div>

          <div className="bg-card border rounded-xl p-8 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dynamic Routing</h3>
            <p className="text-muted-foreground">Auto-detect visitors by country and serve the right offer instantly.</p>
          </div>

          <div className="bg-card border rounded-xl p-8 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-muted-foreground">Real-time analytics with AI-generated performance insights and recommendations.</p>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 mt-20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MAGIC DEAL WITH MJ &copy; 2026 — Admin-only controlled platform</p>
        </div>
      </footer>
    </div>
  )
}
