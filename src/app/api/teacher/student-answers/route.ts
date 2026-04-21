import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const teacherId = searchParams.get("teacherId");

    if (!studentId || !teacherId) {
      return NextResponse.json({ error: "Missing studentId or teacherId" }, { status: 400 });
    }

    const [activitiesRes, talasalitaanRes, feedbackRes] = await Promise.all([
      supabaseAdmin
        .from("4p_answers")
        .select("activity_type, chapter_range, question_index, answer")
        .eq("user_id", studentId),

      supabaseAdmin
        .from("talasalitaan_answers")
        .select("chapter_id, quiz_type, answers, score, updated_at")
        .eq("user_id", studentId)
        .order("updated_at", { ascending: false }),

      supabaseAdmin
        .from("teacher_feedback")
        .select("activity_type, chapter_range, question_index, feedback")
        .eq("teacher_id", teacherId)
        .eq("student_id", studentId),
    ]);

    // For talasalitaan, keep only the latest attempt per chapter
    const latestTalasalitaan: Record<number, any> = {};
    for (const row of talasalitaanRes.data || []) {
      if (!latestTalasalitaan[row.chapter_id]) {
        latestTalasalitaan[row.chapter_id] = row;
      }
    }

    return NextResponse.json({
      activities: activitiesRes.data || [],
      talasalitaan: Object.values(latestTalasalitaan),
      feedback: feedbackRes.data || [],
    });
  } catch (err: any) {
    console.error("student-answers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
