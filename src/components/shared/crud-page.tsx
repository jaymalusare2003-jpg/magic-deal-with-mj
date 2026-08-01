"use client"

import { useState, useMemo, ReactNode } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/shared/data-table"
import { StatCard } from "@/components/shared/stat-card"
import { Plus, Edit, Trash2, Save, X, Search, RefreshCw } from "lucide-react"
import type { Database } from "@/lib/db/types"

type TableName = keyof Database["public"]["Tables"]

export interface ColumnConfig {
  key: string
  header: string
  sortable?: boolean
  render?: (row: any) => ReactNode
}

export interface FieldConfig {
  name: string
  label: string
  type: "text" | "number" | "email" | "url" | "textarea" | "select" | "switch" | "date" | "json" | "image"
  required?: boolean
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  colSpan?: number
  multiple?: boolean
}

export interface CrudConfig {
  table: TableName
  title: string
  description?: string
  columns: ColumnConfig[]
  fields: FieldConfig[]
  searchKey?: string
}

export function CrudPage({ config }: { config: CrudConfig }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const queryClient = useQueryClient()
  const supabase = createClient()

  const { data: rows, isLoading, refetch } = useQuery({
    queryKey: [config.table],
    queryFn: async () => {
      const { data, error } = await supabase.from(config.table).select("*")
      if (error) throw error
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from(config.table).insert(payload).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.table] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: any) => {
      const { data, error } = await supabase
        .from(config.table)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.table] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(config.table).delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.table] })
    },
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const handleSave = async (formData: FormData) => {
    const payload: Record<string, any> = {}
    config.fields.forEach(f => {
      if (f.multiple) {
        payload[f.name] = formData.getAll(f.name)
      } else if (f.type === "number") {
        payload[f.name] = Number(formData.get(f.name) || 0)
      } else if (f.type === "json") {
        const val = formData.get(f.name)
        try { payload[f.name] = val ? JSON.parse(val as string) : null } catch { payload[f.name] = val }
      } else {
        payload[f.name] = formData.get(f.name)
      }
    })

    try {
      if (editingRow) {
        await updateMutation.mutateAsync({ id: editingRow.id, ...payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      setIsDialogOpen(false)
      setEditingRow(null)
    } catch (error) {
      alert("Error saving: " + (error as Error).message)
    }
  }

  const tableColumns = useMemo(() => {
    const cols = config.columns.map(col => ({
      accessorKey: col.key,
      header: col.header,
      cell: col.render
        ? ({ row }: { row: { original: any } }) => col.render!(row.original)
        : ({ row }: { row: { original: any } }) => <span className="text-sm">{row.original[col.key]}</span>,
    }))

    const allColumns = [
      ...cols,
      {
        id: "actions",
        header: "",
        cell: ({ row }: { row: { original: any } }) => {
          const record = row.original
          return (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditingRow(record)
                  setIsDialogOpen(true)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(record.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ]

    return allColumns
  }, [config.columns])

  const filteredRows = searchQuery && config.searchKey
    ? rows?.filter((row: any) =>
        String(row[config.searchKey!]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rows

  const count = rows?.length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{config.title}</h1>
          {config.description && <p className="text-sm text-muted-foreground">{config.description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => { setEditingRow(null); setIsDialogOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={count} icon="Search" />
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${config.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataTable
          columns={tableColumns as any}
          data={filteredRows ?? []}
          searchKey={config.searchKey}
          searchPlaceholder={`Search ${config.title.toLowerCase()}...`}
        />
      </div>

      {isDialogOpen && (
        <CrudDialog
          config={config}
          editingRow={editingRow}
          onClose={() => { setIsDialogOpen(false); setEditingRow(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

interface CrudDialogProps {
  config: CrudConfig
  editingRow: any | null
  onClose: () => void
  onSave: (formData: FormData) => void
}

function CrudDialog({ config, editingRow, onClose, onSave }: CrudDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingRow ? `Edit ${config.title.slice(0, -1)}` : `Add New ${config.title.slice(0, -1)}`}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form action={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.fields.map((field) => (
              <div key={field.name} className={field.colSpan ? `md:col-span-${field.colSpan}` : ""}>
                <Label className="mb-1 block">{field.label}{field.required && <span className="text-destructive">*</span>}</Label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={editingRow?.[field.name]}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    defaultValue={editingRow?.[field.name]}
                    multiple={field.multiple}
                    size={field.multiple ? Math.min(field.options?.length ?? 4, 6) : undefined}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    {!field.multiple && <option value="">Select...</option>}
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "switch" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={field.name}
                      defaultChecked={editingRow?.[field.name]}
                      className="h-4 w-4 rounded"
                    />
                    <Label>{field.label}</Label>
                  </div>
                ) : field.type === "json" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder || "Enter JSON..."}
                    defaultValue={editingRow?.[field.name] ? JSON.stringify(editingRow[field.name], null, 2) : ""}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-xs"
                    rows={4}
                  />
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={editingRow?.[field.name]}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {editingRow ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
