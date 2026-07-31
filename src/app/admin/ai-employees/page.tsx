import { createClient } from "@/lib/supabase/server"
import { CrudPage, CrudConfig } from "@/components/shared/crud-page"
import { Brain, ToggleLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AiEmployeesPage() {
  const supabase = await createClient()
  const { data: employees } = await supabase.from("ai_employees").select("*") as any

  const employeeOptions = (employees || []).map((e: any) => ({ value: e.id, label: e.name }))

  const config: CrudConfig = {
    table: "ai_employees",
    title: "AI Employees",
    description: "Manage your AI employee agents",
    searchKey: "name",
    columns: [
      {
        key: "name",
        header: "Employee",
        render: (row: any) => (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{row.icon}</span>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-sm text-muted-foreground">{row.role}</div>
            </div>
          </div>
        ),
      },
      { key: "role", header: "Role", render: (row: any) => <span className="text-sm text-muted-foreground">{row.role}</span> },
      { key: "ai_model", header: "AI Model", render: (row: any) => <span className="text-sm">{row.ai_model}</span> },
      {
        key: "enabled",
        header: "Status",
        render: (row: any) => <span className={row.enabled ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{row.enabled ? "Active" : "Disabled"}</span>,
      },
      {
        key: "id",
        header: "Actions",
        render: (row: any) => (
          <Link href={`/admin/ai-employees/${row.id}`}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
        ),
      },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "icon", label: "Icon", type: "text", placeholder: "e.g. 🔍" },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      { name: "system_instructions", label: "System Instructions", type: "textarea", required: true, colSpan: 2 },
      { name: "editable_prompt", label: "Editable Prompt", type: "textarea", required: true, colSpan: 2 },
      { name: "ai_model", label: "AI Model", type: "select", options: [
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "gpt-4o-mini", label: "GPT-4o Mini" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      ]},
      { name: "model_config", label: "Model Config (JSON)", type: "json", placeholder: '{"temperature": 0.7, "max_tokens": 4000}' },
      { name: "enabled", label: "Enabled", type: "switch" },
    ],
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Link href="/admin/ai-employees/workflow">
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            AI Campaign Workflow
          </Button>
        </Link>
      </div>
      <CrudPage config={config} />
    </div>
  )
}
