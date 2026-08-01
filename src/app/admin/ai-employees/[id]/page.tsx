import { createClient } from "@/lib/supabase/server"
import { AiEmployeeDetail } from "@/components/admin/ai-employee-detail"

export default async function AiEmployeeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: employee, error } = await supabase
    .from("ai_employees")
    .select("*")
    .eq("id", id)
    .single() as any

  if (!employee) {
    return <div className="p-6">AI Employee not found</div>
  }

  return <AiEmployeeDetail employee={employee} />
}
