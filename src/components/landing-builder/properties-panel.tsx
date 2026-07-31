"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { X, Trash2, Copy } from "lucide-react"

interface PropertiesPanelProps {
  block: any | null
  onUpdate: (blockId: string, updates: any) => void
  onDelete: (blockId: string) => void
  onClose: () => void
}

export function PropertiesPanel({ block, onUpdate, onDelete, onClose }: PropertiesPanelProps) {
  if (!block) {
    return (
      <div className="w-80 bg-card border-l overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Properties</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 text-center text-muted-foreground">
          Select a block to edit its properties
        </div>
      </div>
    )
  }

  const updateField = (field: string, value: any) => {
    onUpdate(block.id, { ...block, [field]: value })
  }

  const updateStyle = (styleKey: string, value: string) => {
    const currentStyles = block.styles || {}
    updateField("styles", { ...currentStyles, [styleKey]: value })
  }

  return (
    <div className="w-80 bg-card border-l overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold capitalize">{block.type} Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {block.type === "text" || block.type === "heading" || block.type === "subheading" || block.type === "paragraph" ? (
          <>
            <div>
              <Label>Content (HTML)</Label>
              <Textarea
                value={block.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label>Text Align</Label>
              <select
                value={block.styles?.textAlign || ""}
                onChange={(e) => updateStyle("textAlign", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Default</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </>
        ) : block.type === "image" ? (
          <>
            <div>
              <Label>Image URL</Label>
              <Input
                value={block.src || ""}
                onChange={(e) => updateField("src", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={block.alt || ""}
                onChange={(e) => updateField("alt", e.target.value)}
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                value={block.caption || ""}
                onChange={(e) => updateField("caption", e.target.value)}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={block.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Width (px)</Label>
              <Input
                type="number"
                value={block.width || ""}
                onChange={(e) => updateField("width", Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Height (px)</Label>
              <Input
                type="number"
                value={block.height || ""}
                onChange={(e) => updateField("height", Number(e.target.value))}
              />
            </div>
          </>
        ) : block.type === "video" || block.type === "embed" ? (
          <>
            <div>
              <Label>URL</Label>
              <Input
                value={block.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://youtube.com/embed/..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.autoplay || false}
                onChange={(e) => updateField("autoplay", e.target.checked)}
              />
              <Label>Autoplay</Label>
            </div>
            {block.type === "video" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={block.controls !== false}
                  onChange={(e) => updateField("controls", e.target.checked)}
                />
                <Label>Show Controls</Label>
              </div>
            )}
            {block.type === "video" && (
              <div>
                <Label>Thumbnail URL</Label>
                <Input
                  value={block.thumbnail || ""}
                  onChange={(e) => updateField("thumbnail", e.target.value)}
                />
              </div>
            )}
          </>
        ) : block.type === "button" || block.type === "cta" ? (
          <>
            <div>
              <Label>Button Text</Label>
              <Input
                value={block.text || ""}
                onChange={(e) => updateField("text", e.target.value)}
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={block.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.openInNewTab || false}
                onChange={(e) => updateField("openInNewTab", e.target.checked)}
              />
              <Label>Open in New Tab</Label>
            </div>
            <div>
              <Label>Link Type</Label>
              <select
                value={block.linkType || "external"}
                onChange={(e) => updateField("linkType", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="affiliate">Affiliate Link</option>
                <option value="external">External Link</option>
                <option value="internal">Internal Link</option>
              </select>
            </div>
          </>
        ) : block.type === "affiliate-link" ? (
          <>
            <div>
              <Label>Link Text</Label>
              <Input
                value={block.text || ""}
                onChange={(e) => updateField("text", e.target.value)}
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={block.url || ""}
                onChange={(e) => updateField("url", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.openInNewTab || false}
                onChange={(e) => updateField("openInNewTab", e.target.checked)}
              />
              <Label>Open in New Tab</Label>
            </div>
          </>
        ) : block.type === "custom-html" ? (
          <div>
            <Label>HTML Content</Label>
            <Textarea
              value={block.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
        ) : block.type === "divider" ? (
          <div>
            <Label>Border Style</Label>
            <select
              value={block.styles?.borderStyle || "solid"}
              onChange={(e) => updateStyle("borderStyle", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>
        ) : block.type === "spacer" ? (
          <div>
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={block.height || 40}
              onChange={(e) => updateField("height", Number(e.target.value))}
            />
          </div>
        ) : block.type === "faq" ? (
          <div>
            <Label>FAQ Items (JSON)</Label>
            <Textarea
              value={JSON.stringify(block.items || [], null, 2)}
              onChange={(e) => {
                try {
                  updateField("items", JSON.parse(e.target.value))
                } catch {}
              }}
              rows={6}
              className="font-mono text-xs"
              placeholder='[{"question": "...", "answer": "..."}]'
            />
          </div>
        ) : block.type === "testimonial" ? (
          <div>
            <Label>Testimonials (JSON)</Label>
            <Textarea
              value={JSON.stringify(block.items || [], null, 2)}
              onChange={(e) => {
                try {
                  updateField("items", JSON.parse(e.target.value))
                } catch {}
              }}
              rows={6}
              className="font-mono text-xs"
            />
          </div>
        ) : block.type === "feature-cards" ? (
          <>
            <div>
              <Label>Columns</Label>
              <select
                value={block.columns || 3}
                onChange={(e) => updateField("columns", Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
              </select>
            </div>
            <div>
              <Label>Feature Cards (JSON)</Label>
              <Textarea
                value={JSON.stringify(block.items || [], null, 2)}
                onChange={(e) => {
                  try {
                    updateField("items", JSON.parse(e.target.value))
                  } catch {}
                }}
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          </>
        ) : block.type === "benefits" ? (
          <div>
            <Label>Benefits (JSON)</Label>
            <Textarea
              value={JSON.stringify(block.items || [], null, 2)}
              onChange={(e) => {
                try {
                  updateField("items", JSON.parse(e.target.value))
                } catch {}
              }}
              rows={6}
              className="font-mono text-xs"
            />
          </div>
        ) : block.type === "pricing" ? (
          <div>
            <Label>Pricing Tiers (JSON)</Label>
            <Textarea
              value={JSON.stringify(block.tiers || [], null, 2)}
              onChange={(e) => {
                try {
                  updateField("tiers", JSON.parse(e.target.value))
                } catch {}
              }}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
        ) : block.type === "social-icons" ? (
          <div>
            <Label>Social Icons (JSON)</Label>
            <Textarea
              value={JSON.stringify(block.items || [], null, 2)}
              onChange={(e) => {
                try {
                  updateField("items", JSON.parse(e.target.value))
                } catch {}
              }}
              rows={6}
              className="font-mono text-xs"
              placeholder='[{"platform": "facebook", "url": "https://..."}]'
            />
          </div>
        ) : (
          <div>
            <Label>Block Data (JSON)</Label>
            <Textarea
              value={JSON.stringify(block, null, 2)}
              onChange={(e) => {
                try {
                  onUpdate(block.id, JSON.parse(e.target.value))
                } catch {}
              }}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-sm mb-2">Styles</h4>
          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.color || "#000000"}
                onChange={(e) => updateStyle("color", e.target.value)}
                className="w-8 h-8 p-0 border rounded cursor-pointer"
              />
              <Input
                value={block.styles?.color || ""}
                onChange={(e) => updateStyle("color", e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.backgroundColor || "#ffffff"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-8 h-8 p-0 border rounded cursor-pointer"
              />
              <Input
                value={block.styles?.backgroundColor || ""}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                placeholder="#ffffff"
              />
            </div>
          </div>
          <div>
            <Label>Border Radius (px)</Label>
            <Input
              type="number"
              value={block.styles?.borderRadius || ""}
              onChange={(e) => updateStyle("borderRadius", e.target.value)}
            />
          </div>
          <div>
            <Label>Padding (px)</Label>
            <Input
              type="number"
              value={block.styles?.padding || ""}
              onChange={(e) => updateStyle("padding", e.target.value + "px")}
            />
          </div>
          <div>
            <Label>Margin (px)</Label>
            <Input
              type="number"
              value={block.styles?.margin || ""}
              onChange={(e) => updateStyle("margin", e.target.value + "px")}
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-4 space-y-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Block
          </Button>
        </div>
      </div>
    </div>
  )
}

PropertiesPanel.displayName = "PropertiesPanel"
