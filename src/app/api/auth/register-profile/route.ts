import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, name, classId, role, className } = await request.json();

    if (!userId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let grade = "";
    let section = "";
    if (className) {
      if (className.includes("-")) {
        const parts = className.split("-");
        grade = parts[0].trim();
        section = parts.slice(1).join("-").trim();
      } else {
        grade = className;
        section = "";
      }
    }

    const { error } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      name,
      role: role || "student",
      class_id: classId || null,
      grade: grade || null,
      section: section || null,
    }, { onConflict: "id" });

    if (error) {
      console.error("Profile creation error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also insert into class_enrollments if classId is present
    if (classId) {
      const { error: enrollError } = await supabaseAdmin.from("class_enrollments").upsert({
        student_id: userId,
        class_id: classId,
      }, { onConflict: "student_id,class_id" });

      if (enrollError) {
        console.error("Class enrollment error:", enrollError);
        // We continue anyway if profile was created, or should we error? 
        // Let's return error to be safe as per user's request
        return NextResponse.json({ error: enrollError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
