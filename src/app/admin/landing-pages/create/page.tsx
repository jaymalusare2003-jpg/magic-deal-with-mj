import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { slugify } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function CreateLandingPagePage() {
  async function createLandingPage(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string || slugify(name)
    const description = formData.get("description") as string

    const { error } = await (supabase as any).from("landing_pages").insert({
      name,
      slug,
      content: { blocks: [] },
      is_published: false,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    }) as any

    if (error) {
      return
    }
  }

  async function handleCreate(formData: FormData) {
    "use server"
    const supabase = await createClient()
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string || slugify(name)
    const { error } = await (supabase as any).from("landing_pages").insert({
      name,
      slug,
      content: { blocks: [] },
      is_published: false,
    })
    if (!error) {
      redirect("/admin/landing-pages")
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Landing Page</h1>
        <p className="text-sm text-muted-foreground">Set up a new landing page to customize in the builder</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form action={handleCreate} className="space-y-4">
            <div>
              <Label>Page Name</Label>
              <Input name="name" placeholder="e.g. Summer Sale Landing Page" required />
            </div>
            <div>
              <Label>Slug</Label>
              <Input name="slug" placeholder="auto-generated-from-name" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" placeholder="Page description (optional)" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit">
                Create & Open Builder
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
