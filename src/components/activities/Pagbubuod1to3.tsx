"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const rubric = [
  { label: "Pag-unawa sa Wakas", points: "5" },
  { label: "Pagpili ng Mahahalagang Detalye", points: "5" },
  { label: "Kaayusan ng Pagkakasulat", points: "5" },
  { label: "Kalinawan ng Kaisipan", points: "5" },
  { label: "Wastong Gamit ng Wika", points: "5" },
];

export default function Pagbubuod1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("4p_answers")
          .select("answer")
          .eq("user_id", user.id)
          .eq("activity_type", "pagbubuod")
          .eq("chapter_range", rangeId)
          .single();
        if (data) setSummary(data.answer || "");
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  useEffect(() => {
    if (!summary.trim()) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "pagbubuod",
            chapter_range: rangeId,
            question_index: 1,
            answer: summary,
          },
          {
            onConflict: "user_id,activity_type,chapter_range,question_index",
          },
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [summary]);

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("4p_answers").upsert(
      {
        user_id: user.id,
        activity_type: "pagbubuod",
        chapter_range: rangeId,
        question_index: 1,
        answer: summary,
      },
      { onConflict: "user_id,activity_type,chapter_range,question_index" },
    );
    alert("Mahusay! Nai-save na.");
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div>
      </div>
    );

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#3e2723] p-1.5">
          <svg
            className="w-4 h-4 text-[#d4af37]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="font-poppins text-lg font-bold text-[#3e2723]">
          Pagbubuod
        </h2>
      </div>
      <p className="mb-3 text-xs text-[#5d4037]">
        Sumulat ng maikling buod (hanggang 10 pangungusap) mula sa Kabanata 1-3.
      </p>
      <textarea
        className="w-full min-h-[120px] rounded-xl border border-[#c4b09a] bg-white p-3 text-xs text-[#3e2723] mb-3 focus:outline-none focus:border-[#8d6e63]"
        placeholder="Simulan ang buod dito..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <div className="rounded-xl overflow-hidden border border-[#8d6e63] mb-3">
        <div className="flex bg-[#5d4037] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-[#8d6e63] text-[#e8d4b0]">
            Pamantayan
          </div>
          <div className="w-16 p-2 text-center text-[#e8d4b0]">Puntos</div>
        </div>
        {rubric.map((row, i) => (
          <div
            key={i}
            className={`flex text-xs border-t border-[#c4b09a] ${i % 2 === 0 ? "bg-[#efede6]" : "bg-[#f5ede0]"}`}
          >
            <div className="flex-1 p-2 border-r border-[#c4b09a] text-[#3e2723]">
              {row.label}
            </div>
            <div className="w-16 p-2 text-center font-semibold text-[#3e2723]">
              {row.points}
            </div>
          </div>
        ))}
        <div className="flex bg-[#5d4037] text-xs font-bold border-t border-[#8d6e63]">
          <div className="flex-1 p-2 border-r border-[#8d6e63] text-[#e8d4b0]">
            Kabuuan
          </div>
          <div className="w-16 p-2 text-center text-[#d4af37]">25</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {saving && <span className="text-xs text-[#8d6e63]">Sine-save...</span>}
        {saved && (
          <span className="text-xs text-[#5d4037] font-semibold">
            ✓ Nai-save na!
          </span>
        )}
        <button
          onClick={save}
          className="flex-1 rounded-full bg-[#3e2723] py-2 hover:bg-[#5d4037] transition-colors"
        >
          <span className="font-bold text-[#e8d4b0] text-sm">
            Ipasa ang Buod
          </span>
        </button>
      </div>
    </div>
  );
}
