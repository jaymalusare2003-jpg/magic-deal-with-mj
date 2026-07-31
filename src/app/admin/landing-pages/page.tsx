import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Eye, Copy, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function LandingPagesPage() {
  const supabase = await createClient()
  const { data: landingPages } = await supabase
    .from("landing_pages")
    .select("*")
    .order("created_at", { ascending: false }) as any

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-sm text-muted-foreground">Build and manage campaign landing pages</p>
        </div>
        <Link href="/admin/landing-pages/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Landing Page
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(landingPages || []).map((page: any) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{page.name}</CardTitle>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  page.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {page.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">/{page.slug}</p>
              <div className="flex gap-2">
                <Link href={`/admin/landing-pages/${page.id}/edit`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(landingPages || []).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No landing pages yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}
