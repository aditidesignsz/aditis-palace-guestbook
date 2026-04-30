import { supabase } from "@/lib/supabase"

export async function GET() {

  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error: error.message })
  }

  return Response.json({ visitors: data })
}
