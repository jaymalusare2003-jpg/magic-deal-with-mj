"use client"

import { BlockType } from "@/lib/db/types"

const BLOCK_DEFINITIONS: Array<{ type: BlockType; name: string; icon: string; description: string }> = [
  { type: "heading", name: "Heading", icon: "H", description: "Large heading text" },
  { type: "subheading", name: "Subheading", icon: "H", description: "Medium subheading text" },
  { type: "paragraph", name: "Paragraph", icon: "¶", description: "Body text paragraph" },
  { type: "text", name: "Text", icon: "T", description: "Custom text block" },
  { type: "image", name: "Image", icon: "🖼️", description: "Upload or link an image" },
  { type: "video", name: "Video", icon: "🎬", description: "Video embed" },
  { type: "button", name: "Button", icon: "🔘", description: "Call-to-action button" },
  { type: "cta", name: "CTA Section", icon: "📢", description: "Call-to-action section" },
  { type: "affiliate-link", name: "Affiliate Link", icon: "🔗", description: "Affiliate tracking link" },
  { type: "divider", name: "Divider", icon: "—", description: "Horizontal divider" },
  { type: "spacer", name: "Spacer", icon: "⬜", description: "Empty spacing block" },
  { type: "faq", name: "FAQ", icon: "❓", description: "Frequently asked questions" },
  { type: "testimonial", name: "Testimonial", icon: "💬", description: "Customer testimonials" },
  { type: "feature-cards", name: "Feature Cards", icon: "🃏", description: "Features in card layout" },
  { type: "benefits", name: "Benefits", icon: "✓", description: "Benefits list" },
  { type: "pricing", name: "Pricing", icon: "💰", description: "Pricing table" },
  { type: "social-icons", name: "Social Icons", icon: "📱", description: "Social media links" },
  { type: "embed", name: "Embed", icon: "🔲", description: "Custom embed block" },
  { type: "custom-html", name: "Custom HTML", icon: "</>", description: "Custom HTML code" },
]

interface BlockPaletteProps {
  onAddBlock: (type: BlockType) => void
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
  return (
    <div className="w-72 bg-card border-r overflow-y-auto">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm">Blocks</h3>
        <p className="text-xs text-muted-foreground mt-1">Click to add</p>
      </div>
      <div className="p-2 space-y-1">
        {BLOCK_DEFINITIONS.map((block) => (
          <button
            key={block.type}
            onClick={() => onAddBlock(block.type)}
            className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-muted transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-muted/50 rounded-lg text-lg">
              {block.icon}
            </div>
            <div>
              <div className="font-medium text-sm">{block.name}</div>
              <div className="text-xs text-muted-foreground">{block.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export { BLOCK_DEFINITIONS }