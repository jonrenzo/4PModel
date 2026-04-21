import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key to bypass RLS — only expose id, name, invite_code
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code || code.trim().length === 0) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("classes")
    .select("id, name")
    .ilike("invite_code", code.trim()) // case-insensitive match
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, name: data.name });
}
