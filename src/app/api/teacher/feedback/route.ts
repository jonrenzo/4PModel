import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacher_id, student_id, activity_type, chapter_range, question_index, feedback } = body;

    if (!teacher_id || !student_id || !activity_type || !chapter_range || !question_index) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("teacher_feedback")
      .upsert(
        {
          teacher_id,
          student_id,
          activity_type,
          chapter_range,
          question_index,
          feedback: feedback ?? "",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "teacher_id,student_id,activity_type,chapter_range,question_index",
        }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("feedback API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
