import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    // 1. Get class info
    const { data: classData, error: classError } = await supabaseAdmin
      .from("classes")
      .select("name")
      .eq("id", classId)
      .single();

    if (classError) throw classError;

    // 2. Get students via class_enrollments
    const { data: enrollmentData, error: enrollError } = await supabaseAdmin
      .from("class_enrollments")
      .select("student_id, profiles(id, name)")
      .eq("class_id", classId);

    if (enrollError) throw enrollError;

    const profiles = enrollmentData
      .map((e: any) => (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles))
      .filter((p) => p !== null);

    if (profiles.length === 0) {
      return NextResponse.json({ className: classData.name, students: [] });
    }

    const studentIds = profiles.map((p) => p.id);

    // 3. Fetch all progress data in parallel using admin key (bypassing RLS)
    const [chaptersRes, talasalitaanRes, activityRes, talaTimestampRes, actTimestampRes] = await Promise.all([
      supabaseAdmin
        .from("chapter_progress")
        .select("user_id, chapter_id")
        .in("user_id", studentIds)
        .eq("is_read", true),
      supabaseAdmin
        .from("talasalitaan_answers")
        .select("user_id, chapter_id")
        .in("user_id", studentIds),
      supabaseAdmin
        .from("4p_answers")
        .select("user_id, activity_type, chapter_range, question_index")
        .in("user_id", studentIds),
      // For last_active: fetch latest updated_at from talasalitaan
      supabaseAdmin
        .from("talasalitaan_answers")
        .select("user_id, updated_at")
        .in("user_id", studentIds),
      // For last_active: fetch latest created_at from 4p_answers
      supabaseAdmin
        .from("4p_answers")
        .select("user_id, created_at")
        .in("user_id", studentIds),
    ]);

    // Derive last_active per student: max of talasalitaan updated_at and 4p_answers created_at
    const lastActiveMap: Record<string, string> = {};
    for (const row of talaTimestampRes.data || []) {
      const uid = row.user_id;
      if (!lastActiveMap[uid] || row.updated_at > lastActiveMap[uid]) {
        lastActiveMap[uid] = row.updated_at;
      }
    }
    for (const row of actTimestampRes.data || []) {
      const uid = row.user_id;
      if (!lastActiveMap[uid] || row.created_at > lastActiveMap[uid]) {
        lastActiveMap[uid] = row.created_at;
      }
    }

    return NextResponse.json({
      className: classData.name,
      profiles,
      chapters: chaptersRes.data || [],
      talasalitaan: talasalitaanRes.data || [],
      activities: activityRes.data || [],
      lastActiveMap,
    });
  } catch (err: any) {
    console.error("Teacher API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
