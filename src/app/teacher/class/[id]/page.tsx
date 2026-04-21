"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Users, BookOpen, ClipboardList, CheckCircle } from "lucide-react";
import ClassMetrics from "@/components/ClassMetrics";

type StudentRow = {
  id: string;
  name: string;
  chaptersRead: number;
  talasalitaanDone: number;
  paghihinuha: number;
  pagsisiyasat: number;
  paglilinaw: number;
  pagbubuod: number;
};

export default function TeacherClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const classId = params.id as string;

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1. Get class info
      const { data: classData } = await supabase
        .from("classes")
        .select("name")
        .eq("id", classId)
        .single();
      setClassName(classData?.name ?? "Klase");

      // 2. Get all students in this class via class_enrollments
      const { data: enrollmentData } = await supabase
        .from("class_enrollments")
        .select("student_id, profiles(id, name)")
        .eq("class_id", classId);

      if (!enrollmentData || enrollmentData.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Extract profiles from the join result
      const profiles = enrollmentData
        .map((e: any) => (Array.isArray(e.profiles) ? e.profiles[0] : e.profiles))
        .filter((p) => p !== null) as { id: string; name: string }[];

      if (profiles.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const studentIds = profiles.map((p) => p.id);

      // 3. Fetch all data sources in parallel
      const [chaptersRes, talasalitaanRes, activityRes] = await Promise.all([
        supabase
          .from("chapter_progress")
          .select("user_id, chapter_id")
          .in("user_id", studentIds)
          .eq("is_read", true),
        supabase
          .from("talasalitaan_answers")
          .select("user_id, chapter_id")
          .in("user_id", studentIds),
        supabase
          .from("4p_answers")
          .select("user_id, activity_type, question_index")
          .in("user_id", studentIds),
      ]);

      const chapterRows = chaptersRes.data ?? [];
      const talasRows = talasalitaanRes.data ?? [];
      const activityRows = activityRes.data ?? [];

      // 4. Aggregate per student
      const rows: StudentRow[] = profiles.map((profile) => {
        const uid = profile.id;

        // Unique chapters read
        const chaptersRead = new Set(
          chapterRows.filter((r) => r.user_id === uid).map((r) => r.chapter_id)
        ).size;

        // Unique chapters with talasalitaan answered
        const talasalitaanDone = new Set(
          talasRows.filter((r) => r.user_id === uid).map((r) => r.chapter_id)
        ).size;

        // 4P activity answers — count unique question_index per activity_type
        const activityData = activityRows.filter((r) => r.user_id === uid);
        const countUnique = (type: string) =>
          new Set(
            activityData
              .filter((r) => r.activity_type === type)
              .map((r) => r.question_index)
          ).size;

        return {
          id: uid,
          name: profile.name ?? "—",
          chaptersRead,
          talasalitaanDone,
          paghihinuha: countUnique("paghihinuha"),
          pagsisiyasat: countUnique("pagsisiyasat"),
          paglilinaw: countUnique("paglilinaw"),
          pagbubuod: countUnique("pagbubuod"),
        };
      });

      setStudents(rows);
      setLoading(false);
    };
    load();
  }, [classId]);

  const cols = [
    { key: "chaptersRead", label: "Kabanata\nNabasa", max: 6, icon: BookOpen },
    { key: "talasalitaanDone", label: "Talasalitaan\nNasagot", max: 6, icon: BookOpen },
    { key: "paghihinuha", label: "Paghihinuha", max: 12, icon: ClipboardList },
    { key: "pagsisiyasat", label: "Pagsisiyasat", max: 10, icon: ClipboardList },
    { key: "paglilinaw", label: "Paglilinaw", max: 10, icon: ClipboardList },
    { key: "pagbubuod", label: "Pagbubuod", max: 4, icon: ClipboardList },
  ] as const;

  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#f5e6c8]">{className}</h1>
          <p className="text-xs text-[#c4b09a]">{students.length} estudyante</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center pt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d4af37]" />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 gap-3 text-[#c4b09a]">
          <Users size={48} className="opacity-40" />
          <p className="text-sm">Wala pang estudyante sa klaseng ito.</p>
        </div>
      ) : (
        <>
          <ClassMetrics students={students} />
          
          <div className="rounded-2xl border border-[#8d6e63] bg-[#efede6] overflow-hidden">
            {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#3e2723] text-[#e8d4b0]">
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    Estudyante
                  </th>
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-center font-semibold text-xs whitespace-pre-line leading-tight"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`border-t border-[#c4b09a] ${
                      idx % 2 === 0 ? "bg-[#efede6]" : "bg-[#f5ede0]"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-[#3e2723] whitespace-nowrap">
                      {student.name}
                    </td>
                    {cols.map((col) => {
                      const val = student[col.key];
                      const pct = Math.min((val / col.max) * 100, 100);
                      const isComplete = val >= col.max;
                      return (
                        <td key={col.key} className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span
                              className={`text-xs font-bold ${
                                isComplete ? "text-[#2e7d32]" : "text-[#5d4037]"
                              }`}
                            >
                              {val}/{col.max}
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-[#c4b09a] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isComplete ? "bg-[#2e7d32]" : "bg-[#8d6e63]"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-[#c4b09a] bg-[#d7ccc8] flex items-center gap-4 text-xs text-[#5d4037]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-[#2e7d32]" />
              <span>Kumpleto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full bg-[#8d6e63]" />
              <span>Hindi pa tapos</span>
            </div>
          </div>
        </div>
      </>
    )}
    </div>
  );
}
