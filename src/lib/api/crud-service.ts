import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/db/types"

type TableName = keyof Database["public"]["Tables"]

export class CrudService {
  private supabase: Awaited<ReturnType<typeof createClient>>
  private table: TableName

  constructor(table: TableName) {
    this.table = table
  }

  async init() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this
  }

  async getAll() {
    const supabase = await this.supabase || await createClient()
    const { data, error } = await supabase.from(this.table).select("*")
    if (error) throw error
    return data
  }

  async getById(id: string) {
    const supabase = await this.supabase || await createClient()
    const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single()
    if (error) throw error
    return data
  }

  async create(payload: any) {
    const supabase = await this.supabase || await createClient()
    const { data, error } = await supabase.from(this.table).insert(payload).select().single()
    if (error) throw error
    return data
  }

  async update(id: string, payload: any) {
    const supabase = await this.supabase || await createClient()
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async remove(id: string) {
    const supabase = await this.supabase || await createClient()
    const { error } = await supabase.from(this.table).delete().eq("id", id)
    if (error) throw error
    return { success: true }
  }
}

export function handleOptions(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
      "Access-Control-Allow-Headers":
        "X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization",
    },
  })
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,DELETE,PATCH,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, X-HTTP-Method-Override, Content-Type, Authorization",
  }
}
