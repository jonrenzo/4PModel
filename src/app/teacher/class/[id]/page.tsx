"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Users, BookOpen, ClipboardList, CheckCircle, RefreshCcw } from "lucide-react";
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
  const loadData = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/teacher/class-progress?classId=${classId}`);
      if (!res.ok) throw new Error("Failed to fetch class data");
      
      const data = await res.json();
      setClassName(data.className);

      if (data.profiles.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const { profiles, chapters, talasalitaan, activities } = data;

      // Aggregate per student
      const rows: StudentRow[] = profiles.map((profile: any) => {
        const uid = profile.id;

        // Unique chapters read
        const chaptersRead = new Set(
          chapters.filter((r: any) => r.user_id === uid).map((r: any) => r.chapter_id)
        ).size;

        // Unique chapters with talasalitaan answered
        const talasalitaanDone = new Set(
          talasalitaan.filter((r: any) => r.user_id === uid).map((r: any) => r.chapter_id)
        ).size;

        // 4P activity answers — count unique (chapter_range + question_index) per activity_type
        const activityData = activities.filter((r: any) => r.user_id === uid);
        const countUnique = (type: string) =>
          new Set(
            activityData
              .filter((r: any) => r.activity_type === type)
              .map((r: any) => `${r.chapter_range}-${r.question_index}`)
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
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  const cols = [
    { key: "chaptersRead", label: "Kabanata\nNabasa", max: 6, icon: BookOpen },
    { key: "talasalitaanDone", label: "Talasalitaan\nNasagot", max: 6, icon: BookOpen },
    { key: "paghihinuha", label: "Paghihinuha", max: 12, icon: ClipboardList },
    { key: "pagsisiyasat", label: "Pagsisiyasat", max: 15, icon: ClipboardList },
    { key: "paglilinaw", label: "Paglilinaw", max: 10, icon: ClipboardList },
    { key: "pagbubuod", label: "Pagbubuod", max: 2, icon: ClipboardList },
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
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#f5e6c8]">{className}</h1>
          <p className="text-xs text-[#c4b09a]">{students.length} estudyante</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Naglo-load..." : "I-refresh"}</span>
        </button>
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
