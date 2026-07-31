import { createClient } from "@/lib/supabase/server"
import { callAIEmployee } from "@/lib/ai/openai-client"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, prompt, context } = body

    if (!employeeId) {
      return NextResponse.json({ error: "employeeId is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: employee, error: fetchError } = await supabase
      .from("ai_employees")
      .select("*")
      .eq("id", employeeId)
      .single() as any

    if (fetchError || !employee) {
      return NextResponse.json({ error: "AI Employee not found" }, { status: 404 })
    }

    if (!employee.enabled) {
      return NextResponse.json({ error: "AI Employee is disabled" }, { status: 400 })
    }

    const userInput = prompt || employee.editable_prompt || ""
    const systemPrompt = employee.system_instructions

    const result = await callAIEmployee(
      systemPrompt,
      userInput + (context ? `\n\nContext: ${JSON.stringify(context)}` : ""),
      employee.ai_model,
      employee.model_config?.temperature || 0.7,
      employee.model_config?.max_tokens || 4000
    )

    const now = new Date().toISOString()
    const taskEntry = {
      timestamp: now,
      prompt: userInput,
      result,
    }

    const currentHistory = employee.task_history || []
    const currentOutput = employee.output_history || []
    const currentLogs = employee.activity_logs || []

    await (supabase as any)
      .from("ai_employees")
      .update({
        task_history: [...currentHistory, { timestamp: now, prompt: userInput.substring(0, 200) }],
        output_history: [...currentOutput, { timestamp: now, output: result.substring(0, 500) }],
        activity_logs: [...currentLogs, { timestamp: now, type: "task_completed", message: "AI task completed successfully" }],
        updated_at: now,
      })
      .eq("id", employeeId)

    await (supabase as any).from("notifications").insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      title: `${employee.name} Task Completed`,
      message: `AI Employee completed a task and generated output.`,
      type: "info",
      read: false,
    }) as any

    return NextResponse.json({
      employee: employee.name,
      result,
      timestamp: now,
    })
  } catch (error) {
    console.error("AI Employee error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    if (!employeeId) {
      const { data: employees, error } = await supabase.from("ai_employees").select("*")
      if (error) throw error
      return NextResponse.json(employees)
    }

    const { data: employee, error } = await supabase
      .from("ai_employees")
      .select("*")
      .eq("id", employeeId)
      .single() as any

    if (error) throw error
    return NextResponse.json(employee)
  } catch (error) {
    console.error("AI Employee GET error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
