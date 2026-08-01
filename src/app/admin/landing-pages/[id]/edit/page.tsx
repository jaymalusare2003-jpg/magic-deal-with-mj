"use client"

import { useState, useCallback, useMemo } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { createClient } from "@/lib/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlockPalette } from "@/components/landing-builder/block-palette"
import { PropertiesPanel } from "@/components/landing-builder/properties-panel"
import { BlockRenderer } from "@/components/landing-blocks/block-renderer"
import TiptapEditor from "@/components/tiptap/tiptap-editor"
import { Save, Download, Eye, Code, Smartphone, Tablet, Monitor, Plus, Trash2, Copy } from "lucide-react"
import { BlockType, ContentBlock } from "@/lib/db/types"
import { generateId } from "@/lib/utils"

const PRESET_STYLES = [
  { name: "Max Width", key: "maxWidth", options: ["600px", "800px", "1000px", "1200px", "100%"] },
  { name: "Padding", key: "padding", options: ["0", "16px", "24px", "32px", "48px"] },
  { name: "Background", key: "background", options: ["white", "gray-50", "gray-100", "gray-900"] },
]

function SortableBlock({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onUpdate,
}: {
  block: any
  isSelected: boolean
  onSelect: (block: any) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onUpdate: (blockId: string, updates: any) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isSelected ? "2px solid var(--primary)" : "1px dashed var(--border)",
    cursor: "grab",
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative mb-4 bg-white dark:bg-gray-900 rounded-lg">
      <div
        className="p-4 cursor-grab active:cursor-grabbing"
        onClick={() => onSelect(block)}
      >
        <BlockRenderer
          block={block}
          isEditing={false}
        />
      </div>

      {isSelected && (
        <div className="absolute -top-8 left-0 flex gap-1 bg-card border rounded shadow-lg p-1 z-20">
          <Button size="sm" variant="ghost" onClick={() => onSelect(block)}>
            <span className="text-xs">Edit</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDuplicate(block.id)}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(block.id)}>
            <Trash2 className="h-3 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function LandingPageBuilder({ params }: { params: { id: string } }) {
  const [selectedBlock, setSelectedBlock] = useState<any>(null)
  const [pageName, setPageName] = useState("")
  const [pageSlug, setPageSlug] = useState("")
  const [pageStyles, setPageStyles] = useState<Record<string, any>>({})
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [seoOgImage, setSeoOgImage] = useState("")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const queryClient = useQueryClient()

  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null
    return createClient()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const { data: landingPage, isLoading } = useQuery({
    queryKey: ["landingPage", params.id],
    queryFn: async () => {
      if (!supabase) throw new Error("Supabase client not available")
      const { data, error } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", params.id)
        .single() as any
      if (error) throw error
      return data
    },
    enabled: !!params.id,
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!supabase) throw new Error("Supabase client not available")
      const { error } = await (supabase as any)
        .from("landing_pages")
        .update(payload)
        .eq("id", params.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landingPage", params.id] })
    },
  })

  useState(() => {
    if (landingPage) {
      setPageName(landingPage.name || "")
      setPageSlug(landingPage.slug || "")
      setPageStyles(landingPage.styles || {})
      const content = landingPage.content || { blocks: [] }
      setBlocks(content.blocks || [])
      if (content.seo) {
        setSeoTitle(content.seo.title || "")
        setSeoDescription(content.seo.description || "")
        setSeoKeywords(content.seo.keywords?.join(", ") || "")
        setSeoOgImage(content.seo.ogImage || "")
      }
    }
  })

  const [blocks, setBlocks] = useState<any[]>([])

  const handleAddBlock = (type: BlockType) => {
    const newBlock = {
      id: generateId(),
      type,
      content: type === "paragraph" ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit." : "",
      styles: {},
    } as any
    setBlocks([...blocks, newBlock])
    setSelectedBlock(newBlock)
  }

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id))
    if (selectedBlock?.id === id) setSelectedBlock(null)
  }

  const handleDuplicateBlock = (id: string) => {
    const block = blocks.find(b => b.id === id)
    if (block) {
      const newBlock = { ...block, id: generateId() }
      setBlocks([...blocks, newBlock])
    }
  }

  const handleUpdateBlock = (blockId: string, updates: any) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, ...updates } : b))
    if (selectedBlock?.id === blockId) setSelectedBlock({ ...selectedBlock, ...updates })
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex(b => b.id === active.id)
      const newIndex = blocks.findIndex(b => b.id === over.id)
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const handleSave = async () => {
    const content = {
      blocks,
      styles: pageStyles,
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords.split(",").map(k => k.trim()).filter(Boolean),
        ogImage: seoOgImage,
      },
    }

    await updateMutation.mutateAsync({
      name: pageName,
      slug: pageSlug,
      content,
      styles: pageStyles,
      is_published: landingPage?.is_published || false,
      updated_at: new Date().toISOString(),
    })
  }

  const handlePublish = async () => {
    await handleSave()
    await updateMutation.mutateAsync({
      name: pageName,
      slug: pageSlug,
      content: {
        blocks,
        styles: pageStyles,
        seo: {
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywords.split(",").map(k => k.trim()).filter(Boolean),
          ogImage: seoOgImage,
        },
      },
      styles: pageStyles,
      is_published: true,
      updated_at: new Date().toISOString(),
    })
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!landingPage) {
    return <div className="p-6">Landing page not found</div>
  }

  const previewClassName = {
    desktop: "max-w-full",
    tablet: "max-w-3xl mx-auto",
    mobile: "max-w-sm mx-auto",
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <BlockPalette onAddBlock={handleAddBlock} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Page Name"
              className="font-semibold text-lg"
            />
            <Input
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="Slug"
              className="w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Code className="h-4 w-4 mr-2" />
              Code View
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handlePublish}>
              <Download className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/30 p-6">
          <div className={previewClassName[previewMode]}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {blocks.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <p>Drag blocks from the left panel or click them to add content.</p>
                    </div>
                  ) : (
                    blocks.map((block) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        isSelected={selectedBlock?.id === block.id}
                        onSelect={setSelectedBlock}
                        onDelete={handleDeleteBlock}
                        onDuplicate={handleDuplicateBlock}
                        onUpdate={handleUpdateBlock}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <PropertiesPanel
        block={selectedBlock}
        onUpdate={handleUpdateBlock}
        onDelete={handleDeleteBlock}
        onClose={() => setSelectedBlock(null)}
      />
    </div>
  )
}
