"use client"

import { ContentBlock } from "@/lib/db/types"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface BlockRendererProps {
  block: any
  isEditing?: boolean
  onEdit?: (block: any) => void
  onDelete?: (blockId: string) => void
  onDuplicate?: (blockId: string) => void
  className?: string
}

export function BlockRenderer({ block, isEditing, onEdit, onDelete, onDuplicate }: BlockRendererProps) {
  if (!block) return null

  const handleEdit = () => {
    if (onEdit) onEdit(block)
  }

  const handleDelete = () => {
    if (onDelete) onDelete(block.id)
  }

  const handleDuplicate = () => {
    if (onDuplicate) onDuplicate(block.id)
  }

  const commonWrapper = cn(
    "relative group transition-all",
    block.styles?.margin,
    block.styles?.padding
  )

  switch (block.type) {
    case "text":
    case "heading":
    case "subheading":
    case "paragraph":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">
                <span className="text-xs">✏️</span>
              </button>
              <button onClick={handleDuplicate} className="p-1 bg-muted rounded shadow-sm">
                <span className="text-xs">📋</span>
              </button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">
                <span className="text-xs">✕</span>
              </button>
            </div>
          )}
          {block.type === "text" && (
            <div
              className="text-base"
              style={block.styles ? { color: block.styles.color, fontSize: block.styles.fontSize, fontFamily: block.styles.fontFamily } : {}}
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          )}
          {block.type === "heading" && (
            <h2
              className="text-3xl font-bold"
              style={block.styles ? { color: block.styles.color, fontSize: block.styles.fontSize, fontFamily: block.styles.fontFamily, textAlign: block.styles.alignText } : {}}
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          )}
          {block.type === "subheading" && (
            <h3
              className="text-xl font-semibold"
              style={block.styles ? { color: block.styles.color, fontSize: block.styles.fontSize } : {}}
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          )}
          {block.type === "paragraph" && (
            <p
              className="text-base"
              style={block.styles ? { color: block.styles.color, fontSize: block.styles.fontSize } : {}}
              dangerouslySetInnerHTML={{ __html: block.content || "" }}
            />
          )}
        </div>
      )

    case "image":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDuplicate} className="p-1 bg-muted rounded shadow-sm">📋</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="relative inline-block" style={{ borderRadius: block.styles?.borderRadius }}>
            <img
              src={block.src || ""}
              alt={block.alt || ""}
              className="max-w-full h-auto"
              style={{
                maxWidth: block.width,
                borderRadius: block.styles?.borderRadius,
                border: block.styles?.border,
              }}
            />
            {block.caption && (
              <p className="text-center text-sm text-muted-foreground mt-2">{block.caption}</p>
            )}
          </div>
        </div>
      )

    case "video":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src={block.url}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow={block.controls ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" : undefined}
              allowFullScreen={block.controls}
              title="Video content"
            />
          </div>
        </div>
      )

    case "button":
    case "cta":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="text-center">
            <a
              href={block.url}
              target={block.openInNewTab ? "_blank" : "_self"}
              rel={block.openInNewTab ? "noopener noreferrer" : undefined}
              className="inline-block px-8 py-3 rounded-lg font-semibold text-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: block.styles?.buttonColor || "var(--primary)",
                color: block.styles?.textColor || "var(--primary-foreground)",
                borderRadius: block.styles?.borderRadius,
              }}
            >
              {block.text || block.content || "Click Here"}
            </a>
          </div>
        </div>
      )

    case "affiliate-link":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {block.text || block.url}
          </a>
        </div>
      )

    case "divider":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <hr className="border-t-2 border-border my-4" style={{ borderStyle: block.styles?.borderStyle || "solid" }} />
        </div>
      )

    case "spacer":
      return (
        <div
          className={commonWrapper}
          style={{ height: block.height || 40 }}
        >
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
        </div>
      )

    case "faq":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            {(block.items || []).map((item: any, i: number) => (
              <details key={i} className="mb-3 border rounded-lg p-3">
                <summary className="font-semibold cursor-pointer">{item.question}</summary>
                <p className="mt-2 text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      )

    case "testimonial":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(block.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-4 bg-muted/30">
                <p className="italic mb-2">"{item.quote}"</p>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case "feature-cards":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className={`grid gap-4 ${block.columns == 1 ? "grid-cols-1" : block.columns == 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {(block.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-6 bg-card text-center">
                {item.icon && <div className="text-3xl mb-3">{item.icon}</div>}
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "benefits":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="space-y-3">
            {(block.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="text-xl mt-0.5">{item.icon || "✓"}</div>
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "pricing":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {(block.tiers || []).map((tier: any, i: number) => (
              <div key={i} className="border rounded-lg p-6 bg-card">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold mb-4">{tier.price}</div>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <ul className="text-sm space-y-1 mb-4">
                  {tier.features?.map((f: string, j: number) => (
                    <li key={j}>✓ {f}</li>
                  ))}
                </ul>
                {tier.ctaText && tier.ctaLink && (
                  <a href={tier.ctaLink} className="inline-block w-full text-center py-2 bg-primary text-primary-foreground rounded-lg">
                    {tier.ctaText}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )

    case "social-icons":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="flex justify-center gap-4">
            {(block.items || []).map((item: any, i: number) => {
              const iconMap: Record<string, string> = {
                facebook: "🔵", twitter: "🐦", instagram: "📷", linkedin: "💼",
                youtube: "🎥", pinterest: "📌", tiktok: "🎵", telegram: "✈️",
                whatsapp: "💬", discord: "🎮",
              }
              return (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="text-2xl">
                  {iconMap[item.platform] || "🔗"}
                </a>
              )
            })}
          </div>
        </div>
      )

    case "embed":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src={block.url}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
              title="Embedded content"
            />
          </div>
        </div>
      )

    case "custom-html":
      return (
        <div className={commonWrapper}>
          {isEditing && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
              <button onClick={handleEdit} className="p-1 bg-muted rounded shadow-sm">✏️</button>
              <button onClick={handleDelete} className="p-1 bg-destructive text-destructive-foreground rounded shadow-sm">✕</button>
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: block.content || "" }} />
        </div>
      )

    default:
      return (
        <div className={commonWrapper}>
          <p className="text-muted-foreground">{`Unknown block type: ${block.type}`}</p>
        </div>
      )
  }
}

export default BlockRenderer
