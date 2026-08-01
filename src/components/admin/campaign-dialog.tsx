"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

interface CampaignDialogProps {
  offers: any[]
  networks: any[]
  categories: any[]
  countries: any[]
  landingPages: any[]
}

export function CampaignDialog({ offers, networks, categories, countries, landingPages }: CampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Campaign
      </Button>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        setOpen(false)
        window.location.reload()
      } else {
        const data = await res.json()
        setSubmitError(data.error || 'Failed to create campaign')
      }
    } catch (err) {
      setSubmitError('Failed to create campaign')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Campaign</h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {submitError && (
          <div className="mx-6 mt-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input name="name" placeholder="e.g. Summer Sale USA" required />
            </div>
            <div>
              <Label>Slug</Label>
              <Input name="slug" placeholder="auto-generated" />
            </div>
            <div>
              <Label>Offer *</Label>
              <select name="offer_id" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Offer</option>
                {offers.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Country *</Label>
              <select name="country_id" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Country</option>
                {countries.map((c: any) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
              </select>
            </div>
            <div>
              <Label>Category</Label>
              <select name="category_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Category</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Landing Page</Label>
              <select name="landing_page_id" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Select Landing Page</option>
                {landingPages.map((lp: any) => <option key={lp.id} value={lp.id}>{lp.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select name="status" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <Label>Budget ($)</Label>
              <Input name="budget" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input name="start_date" type="date" />
            </div>
            <div>
              <Label>End Date</Label>
              <Input name="end_date" type="date" />
            </div>
            <div className="md:col-span-2">
              <Label>Country-Offer Mapping (JSON)</Label>
              <textarea name="country_offer_mapping" placeholder='{"US": "offer-a-id", "UK": "offer-b-id"}' className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono" rows={4} />
            </div>
            <div className="md:col-span-2">
              <Label>Notes</Label>
              <Textarea name="notes" placeholder="Additional notes..." />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-lg hover:bg-muted">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg">
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
