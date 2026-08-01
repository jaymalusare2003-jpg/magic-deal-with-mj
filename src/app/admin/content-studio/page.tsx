"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import TiptapEditor from "@/components/tiptap/tiptap-editor"
import { Copy, Download, Save, Send, FileText, Share2, Hash } from "lucide-react"

const CONTENT_TYPES = [
  { id: "blog-post", name: "Blog Post", description: "Full-length SEO blog article" },
  { id: "seo-article", name: "SEO Article", description: "Optimized article content" },
  { id: "social-post", name: "Social Post", description: "Social media caption and content" },
  { id: "pinterest", name: "Pinterest", description: "Pinterest pin description and title" },
  { id: "youtube", name: "YouTube", description: "YouTube title and description" },
  { id: "ad-copy", name: "Ad Copy", description: "Advertising copy variations" },
  { id: "cta-variations", name: "CTA Variations", description: "Call-to-action variations" },
]

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "persuasive", label: "Persuasive" },
  { value: "friendly", label: "Friendly" },
  { value: "authoritative", label: "Authoritative" },
  { value: "humorous", label: "Humorous" },
  { value: "urgent", label: "Urgent" },
  { value: "casual", label: "Casual" },
]

const LENGTHS = [
  { value: "short", label: "Short (100-300 words)" },
  { value: "medium", label: "Medium (300-800 words)" },
  { value: "long", label: "Long (800-2000 words)" },
]

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState("blog-post")
  const [topic, setTopic] = useState("")
  const [country, setCountry] = useState("US")
  const [language, setLanguage] = useState("en")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedContents, setSavedContents] = useState<any[]>([])
  const queryClient = useQueryClient()
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null
    return createClient()
  }, [])

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      if (!supabase) return []
      const { data, error } = await supabase.from("countries").select("code, name")
      if (error) throw error
      return data
    },
  })

  const handleGenerate = async () => {
    if (!topic) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      if (!supabase) throw new Error("Supabase client not available")
      const { data: employee } = await (supabase as any)
        .from("ai_employees")
        .select("id")
        .eq("role", "content-employee")
        .eq("enabled", true)
        .single()

      if (!employee) {
        setGeneratedContent("<p>Error: AI Content Employee not found or disabled. Please verify the employee exists in the database.</p>")
        setIsGenerating(false)
        return
      }

      const response = await fetch("/api/ai/run-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          prompt: `Generate ${activeTab.replace("-", " ")} content about "${topic}" for country ${country}, in ${language} language, with ${tone} tone, ${length} length. Format as proper HTML and return only the content without explanations.`,
        }),
      })

      const result = await response.json()
      if (result.result) {
        setGeneratedContent(result.result)
      } else {
        setGeneratedContent(`<p>Error generating content: ${result.error || "Please check your OpenAI API key configuration."}</p>`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setGeneratedContent(`<p>Error generating content: ${errorMessage}</p>`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = async () => {
    if (!supabase) return
    await (supabase as any).from("app_settings").insert({
      key: `content_${Date.now()}`,
      value: {
        type: activeTab,
        topic,
        country,
        language,
        tone,
        content: generatedContent,
        created_at: new Date().toISOString(),
      },
      description: `Saved ${activeTab} content`,
    })
    setSavedContents([...savedContents, {
      type: activeTab,
      topic,
      content: generatedContent,
      saved_at: new Date().toISOString(),
    }])
  }

  const handleExport = (format: "copy" | "txt" | "md") => {
    if (format === "copy") {
      navigator.clipboard.writeText(generatedContent)
    } else if (format === "txt") {
      const blob = new Blob([generatedContent.replace(/<[^>]*>/g, "")], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${topic.replace(/\s+/g, "-")}.txt`
      a.click()
    } else if (format === "md") {
      const blob = new Blob([generatedContent], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${topic.replace(/\s+/g, "-")}.md`
      a.click()
    }
  }

  const activeContentType = CONTENT_TYPES.find(c => c.id === activeTab)

  return (
    <div className="p-6 h-screen overflow-hidden flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Content Studio</h1>
        <p className="text-sm text-muted-foreground">AI-powered content generation and editing</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid grid-cols-7 mb-4">
          {CONTENT_TYPES.map(ct => (
            <TabsTrigger key={ct.id} value={ct.id}>
              {ct.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {CONTENT_TYPES.map(ct => (
          <TabsContent key={ct.id} value={ct.id} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{ct.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{ct.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Topic / Keyword</Label>
                      <Input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your topic or main keyword..."
                      />
                    </div>
                    <div>
                      <Label>Country</Label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      >
                        {(countries || []).map(c => (
                          <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="pt">Portuguese</option>
                        <option value="it">Italian</option>
                      </select>
                    </div>
                    <div>
                      <Label>Tone</Label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      >
                        {TONES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label>Length</Label>
                    <div className="flex gap-4 mt-2">
                      {LENGTHS.map(l => (
                        <label key={l.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="length"
                            value={l.value}
                            checked={length === l.value}
                            onChange={(e) => setLength(e.target.value)}
                          />
                          <span className="text-sm">{l.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <Button onClick={handleGenerate} disabled={isGenerating || !topic} size="lg">
                      {isGenerating ? "Generating..." : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {generatedContent && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TiptapEditor
                      content={generatedContent}
                      onChange={setGeneratedContent}
                      placeholder="Generated content will appear here..."
                      height="min-h-[300px]"
                    />

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleExport("copy")}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExport("txt")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download TXT
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExport("md")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download MD
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleSaveContent}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {savedContents.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Content Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {savedContents.map((item, i) => (
                <div key={i} className="border rounded-lg p-3 text-sm">
                  <div className="font-medium">{item.topic}</div>
                  <div className="text-muted-foreground">{item.type} • {item.saved_at}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
