"use client";
import * as XLSX from "xlsx";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft,
  Users,
  BookOpen,
  ClipboardList,
  RefreshCcw,
  Search,
  FileSpreadsheet,
  ChevronUp,
  ChevronDown,
  X,
  Filter,
} from "lucide-react";
import ClassMetrics from "@/components/ClassMetrics";
import StudentAnswerPanel from "@/components/StudentAnswerPanel";

// ── Types ────────────────────────────────────────────────────────────────────
type StudentRow = {
  id: string;
  name: string;
  chaptersRead: number;
  talasalitaanDone: number;
  paghihinuha: number;
  pagsisiyasat: number;
  paglilinaw: number;
  pagbubuod: number;
  lastActive: string | null;
};

type SortKey = "name" | "progress" | "lastActive";
type SortDir = "asc" | "desc";
type FilterStatus = "notStarted" | "inProgress" | "completed";

const MAXES = {
  chaptersRead: 6,
  talasalitaanDone: 6,
  paghihinuha: 12,
  pagsisiyasat: 15,
  paglilinaw: 10,
  pagbubuod: 2,
};

// ── Fuzzy match ──────────────────────────────────────────────────────────────
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    while (ti < t.length && t[ti] !== q[qi]) ti++;
    if (ti >= t.length) return false;
    ti++;
  }
  return true;
}

// ── Progress score (0–1) ─────────────────────────────────────────────────────
function progressScore(s: StudentRow): number {
  const cols = Object.keys(MAXES) as (keyof typeof MAXES)[];
  const total = cols.reduce((sum, k) => sum + MAXES[k], 0);
  const done = cols.reduce((sum, k) => sum + Math.min(s[k], MAXES[k]), 0);
  return done / total;
}

// ── Status ───────────────────────────────────────────────────────────────────
function getStatus(s: StudentRow): FilterStatus {
  const score = progressScore(s);
  if (score === 0) return "notStarted";
  const allDone = Object.keys(MAXES).every(
    (k) => s[k as keyof typeof MAXES] >= MAXES[k as keyof typeof MAXES],
  );
  return allDone ? "completed" : "inProgress";
}

// ── Excel Export ─────────────────────────────────────────────────────────────
function exportExcel(students: StudentRow[], className: string) {
  const headers = [
    "Pangalan",
    "Kabanata Nabasa",
    "Talasalitaan Nasagot",
    "Paghihinuha",
    "Pagsisiyasat",
    "Paglilinaw",
    "Pagbubuod",
    "Huling Aktibo",
  ];
  const rows = students.map((s) => [
    s.name,
    `${s.chaptersRead}/${MAXES.chaptersRead}`,
    `${s.talasalitaanDone}/${MAXES.talasalitaanDone}`,
    `${s.paghihinuha}/${MAXES.paghihinuha}`,
    `${s.pagsisiyasat}/${MAXES.pagsisiyasat}`,
    `${s.paglilinaw}/${MAXES.paglilinaw}`,
    `${s.pagbubuod}/${MAXES.pagbubuod}`,
    s.lastActive ? new Date(s.lastActive).toLocaleDateString("fil-PH") : "—",
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Column widths
  ws["!cols"] = [
    { wch: 28 },
    { wch: 16 },
    { wch: 20 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Progress");
  XLSX.writeFile(wb, `${className.replace(/\s+/g, "_")}_progress.xlsx`);
}

// ── Excel Confirm Modal ───────────────────────────────────────────────────────
function ExcelModal({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[#f5ede0] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#c4b09a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#3e2723] rounded-xl">
            <FileSpreadsheet size={18} className="text-[#d4af37]" />
          </div>
          <h3 className="text-base font-bold text-[#3e2723]">
            I-export ang Excel
          </h3>
        </div>
        <p className="text-sm text-[#5d4037] mb-6 leading-relaxed">
          Iki-download ang pag-unlad ng{" "}
          <span className="font-bold text-[#3e2723]">{count} estudyante</span>{" "}
          bilang <span className="font-bold text-[#3e2723]">.xlsx</span> file.
          Itutuloy ba?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#c4b09a] text-[#5d4037] text-sm font-semibold hover:bg-[#ede0d4] transition-colors"
          >
            Kanselahin
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#3e2723] text-[#d4af37] text-sm font-bold hover:bg-[#5d4037] transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet size={14} /> I-download
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
const cols = [
  {
    key: "chaptersRead" as const,
    label: "Kabanata\nNabasa",
    max: MAXES.chaptersRead,
    icon: BookOpen,
  },
  {
    key: "talasalitaanDone" as const,
    label: "Talasalitaan\nNasagot",
    max: MAXES.talasalitaanDone,
    icon: BookOpen,
  },
  {
    key: "paghihinuha" as const,
    label: "Paghihinuha",
    max: MAXES.paghihinuha,
    icon: ClipboardList,
  },
  {
    key: "pagsisiyasat" as const,
    label: "Pagsisiyasat",
    max: MAXES.pagsisiyasat,
    icon: ClipboardList,
  },
  {
    key: "paglilinaw" as const,
    label: "Paglilinaw",
    max: MAXES.paglilinaw,
    icon: ClipboardList,
  },
  {
    key: "pagbubuod" as const,
    label: "Pagbubuod",
    max: MAXES.pagbubuod,
    icon: ClipboardList,
  },
] as const;

export default function TeacherClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const classId = params.id as string;

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(
    null,
  );

  // Controls
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [activeFilters, setActiveFilters] = useState<Set<FilterStatus>>(
    new Set(),
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  useEffect(() => {
    const getTeacher = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setTeacherId(user.id);
    };
    getTeacher();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teacher/class-progress?classId=${classId}`);
      if (!res.ok) throw new Error("Failed to fetch class data");
      const data = await res.json();
      setClassName(data.className);

      if (!data.profiles || data.profiles.length === 0) {
        setStudents([]);
        return;
      }

      const { profiles, chapters, talasalitaan, activities, lastActiveMap } =
        data;

      const rows: StudentRow[] = profiles.map((profile: any) => {
        const uid = profile.id;
        const chaptersRead = new Set(
          chapters
            .filter((r: any) => r.user_id === uid)
            .map((r: any) => r.chapter_id),
        ).size;
        const talasalitaanDone = new Set(
          talasalitaan
            .filter((r: any) => r.user_id === uid)
            .map((r: any) => r.chapter_id),
        ).size;
        const activityData = activities.filter((r: any) => r.user_id === uid);
        const countUnique = (type: string) =>
          new Set(
            activityData
              .filter((r: any) => r.activity_type === type)
              .map((r: any) => `${r.chapter_range}-${r.question_index}`),
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
          lastActive: lastActiveMap?.[uid] ?? null,
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

  // ── Derived list ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = students.filter((s) => fuzzyMatch(s.name, search));
    if (activeFilters.size > 0) {
      list = list.filter((s) => activeFilters.has(getStatus(s)));
    }
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "progress")
        cmp = progressScore(a) - progressScore(b);
      else if (sortKey === "lastActive") {
        const ta = a.lastActive ? new Date(a.lastActive).getTime() : 0;
        const tb = b.lastActive ? new Date(b.lastActive).getTime() : 0;
        cmp = ta - tb;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [students, search, activeFilters, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleFilter = (f: FilterStatus) => {
    setActiveFilters((prev) => {
      const s = new Set(prev);
      s.has(f) ? s.delete(f) : s.add(f);
      return s;
    });
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? (
        <ChevronUp size={12} />
      ) : (
        <ChevronDown size={12} />
      )
    ) : null;

  const filterLabels: { key: FilterStatus; label: string; color: string }[] = [
    { key: "notStarted", label: "Hindi pa nagsimula", color: "#c4b09a" },
    { key: "inProgress", label: "Nasa proseso", color: "#8d6e63" },
    { key: "completed", label: "Kumpleto", color: "#2e7d32" },
  ];

  return (
    <div className="min-h-screen bg-[#4f2b21] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#f5e6c8] truncate">
            {className}
          </h1>
          <p className="text-xs text-[#c4b09a]">{students.length} estudyante</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">
            {loading ? "Naglo-load..." : "I-refresh"}
          </span>
        </button>
      </div>

      {/* Toolbar */}
      {!loading && students.length > 0 && (
        <div className="mb-4 space-y-2">
          {/* Row 1: Search + Filter toggle + CSV */}
          <div className="flex gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d6e63]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hanapin ang estudyante..."
                className="w-full pl-8 pr-8 py-2 rounded-xl bg-[#f5ede0] text-sm text-[#3e2723] placeholder-[#a1887f] border border-[#c4b09a] focus:outline-none focus:border-[#8d6e63] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1887f] hover:text-[#3e2723]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${showFilters || activeFilters.size > 0 ? "bg-[#3e2723] text-[#d4af37] border-[#3e2723]" : "bg-[#f5ede0] text-[#5d4037] border-[#c4b09a] hover:border-[#8d6e63]"}`}
            >
              <Filter size={13} />
              <span className="hidden sm:inline">Filter</span>
              {activeFilters.size > 0 && (
                <span className="bg-[#d4af37] text-[#3e2723] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {activeFilters.size}
                </span>
              )}
            </button>
            {/* Excel Export */}
            <button
              onClick={() => setShowCSVModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#c4b09a] bg-[#f5ede0] text-[#5d4037] text-xs font-semibold hover:border-[#8d6e63] transition-colors"
            >
              <FileSpreadsheet size={13} />
              <span className="hidden sm:inline">Excel</span>
            </button>
          </div>

          {/* Row 2: Filters (collapsible) */}
          {showFilters && (
            <div className="bg-[#f5ede0] rounded-xl border border-[#c4b09a] px-3 py-2.5 flex flex-wrap gap-3 items-center">
              <span className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-wide">
                Katayuan:
              </span>
              {filterLabels.map(({ key, label, color }) => (
                <label
                  key={key}
                  className="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.has(key)}
                    onChange={() => toggleFilter(key)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${activeFilters.has(key) ? "border-transparent" : "border-[#c4b09a] bg-white"}`}
                    style={
                      activeFilters.has(key)
                        ? { backgroundColor: color, borderColor: color }
                        : {}
                    }
                  >
                    {activeFilters.has(key) && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path
                          d="M1 3.5L3.5 6L8 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-[#3e2723]">{label}</span>
                </label>
              ))}
              {activeFilters.size > 0 && (
                <button
                  onClick={() => setActiveFilters(new Set())}
                  className="text-[10px] text-[#8d6e63] hover:text-[#3e2723] underline ml-auto"
                >
                  I-clear lahat
                </button>
              )}
            </div>
          )}

          {/* Row 3: Sort */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-[#c4b09a] uppercase tracking-wide whitespace-nowrap">
              Ayusin:
            </span>
            {(
              [
                ["name", "Pangalan"],
                ["progress", "Pag-unlad"],
                ["lastActive", "Huling Aktibo"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${sortKey === key ? "bg-[#f5ede0] text-[#3e2723]" : "text-[#c4b09a] hover:text-[#f5ede0]"}`}
              >
                {label} <SortIcon k={key} />
              </button>
            ))}
            <span className="text-[#c4b09a] text-xs ml-auto whitespace-nowrap">
              {filtered.length} / {students.length}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
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
                    <th className="px-3 py-3 text-center font-semibold text-xs whitespace-nowrap">
                      Huling Aktibo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={cols.length + 2}
                        className="text-center py-12 text-[#8d6e63] text-sm"
                      >
                        Walang estudyanteng natutugunan sa paghahanap.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((student, idx) => (
                      <tr
                        key={student.id}
                        className={`border-t border-[#c4b09a] ${idx % 2 === 0 ? "bg-[#efede6]" : "bg-[#f5ede0]"}`}
                      >
                        <td
                          className="px-4 py-3 font-medium text-[#3e2723] whitespace-nowrap cursor-pointer hover:text-[#5d4037] hover:underline decoration-[#8d6e63] underline-offset-2 transition-colors"
                          onClick={() => setSelectedStudent(student)}
                          title="Tingnan ang mga sagot"
                        >
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
                                  className={`text-xs font-bold ${isComplete ? "text-[#2e7d32]" : "text-[#5d4037]"}`}
                                >
                                  {val}/{col.max}
                                </span>
                                <div className="w-16 h-1.5 rounded-full bg-[#c4b09a] overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${isComplete ? "bg-[#2e7d32]" : "bg-[#8d6e63]"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-center text-xs text-[#8d6e63] whitespace-nowrap">
                          {student.lastActive ? (
                            new Date(student.lastActive).toLocaleDateString(
                              "fil-PH",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          ) : (
                            <span className="text-[#c4b09a]">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="px-4 py-3 border-t border-[#c4b09a] bg-[#d7ccc8] flex flex-wrap items-center gap-4 text-xs text-[#5d4037]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-[#2e7d32]" />
                <span>Kumpleto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-[#8d6e63]" />
                <span>Hindi pa tapos</span>
              </div>
              <div className="ml-auto text-[#8d6e63]">
                Pindutin ang pangalan para makita ang mga sagot
              </div>
            </div>
          </div>
        </>
      )}

      {/* Student Answer Panel */}
      {selectedStudent && teacherId && (
        <StudentAnswerPanel
          student={{ id: selectedStudent.id, name: selectedStudent.name }}
          teacherId={teacherId}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Excel Confirm Modal */}
      {showCSVModal && (
        <ExcelModal
          count={students.length}
          onCancel={() => setShowCSVModal(false)}
          onConfirm={() => {
            exportExcel(students, className);
            setShowCSVModal(false);
          }}
        />
      )}
    </div>
  );
}
