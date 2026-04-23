"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const rows = [
  { id: 1, images: ["/tomb.png"], item: "Tomb" },
  { id: 2, images: ["/fan.png", "/cross.png"], item: "Fan & Cross" },
  { id: 3, images: ["/cane.png", "/chest.png"], item: "Cane & Chest" },
];

export default function Paghihinuha4to6({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [answers, setAnswers] = useState<
    Record<number, { tauhan: string; pahiwatig: string }>
  >({});
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
          .select("*")
          .eq("user_id", user.id)
          .eq("activity_type", "paghihinuha")
          .eq("chapter_range", rangeId);
        if (data) {
          const map: any = {};
          data.forEach((i: any) => {
            const [rid, field] = i.question_index.toString().split("-");
            const r = Number(rid);
            if (!map[r]) map[r] = { tauhan: "", pahiwatig: "" };
            if (field === "tauhan") map[r].tauhan = i.answer;
            if (field === "pahiwatig") map[r].pahiwatig = i.answer;
          });
          setAnswers(map);
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasAnswers = Object.values(answers).some(
        (a) => a?.tauhan || a?.pahiwatig,
      );
      if (!hasAnswers) return;

      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        for (const row of rows) {
          const a = answers[row.id];
          if (a?.tauhan)
            await supabase.from("4p_answers").upsert(
              {
                user_id: user.id,
                activity_type: "paghihinuha",
                chapter_range: rangeId,
                question_index: `${row.id}-tauhan`,
                answer: a.tauhan,
              },
              {
                onConflict:
                  "user_id,activity_type,chapter_range,question_index",
              },
            );
          if (a?.pahiwatig)
            await supabase.from("4p_answers").upsert(
              {
                user_id: user.id,
                activity_type: "paghihinuha",
                chapter_range: rangeId,
                question_index: `${row.id}-pahiwatig`,
                answer: a.pahiwatig,
              },
              {
                onConflict:
                  "user_id,activity_type,chapter_range,question_index",
              },
            );
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [answers]);

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    for (const row of rows) {
      const a = answers[row.id];
      if (a?.tauhan)
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "paghihinuha",
            chapter_range: rangeId,
            question_index: `${row.id}-tauhan`,
            answer: a.tauhan,
          },
          {
            onConflict: "user_id,activity_type,chapter_range,question_index",
          },
        );
      if (a?.pahiwatig)
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "paghihinuha",
            chapter_range: rangeId,
            question_index: `${row.id}-pahiwatig`,
            answer: a.pahiwatig,
          },
          {
            onConflict: "user_id,activity_type,chapter_range,question_index",
          },
        );
    }
    alert("Nai-save!");
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
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="font-poppins text-lg font-bold text-[#3e2723]">
          Paghihinuha
        </h2>
      </div>
      <p className="mb-3 text-xs text-[#5d4037]">
        Suriin ang bawat bagay at tukuyin ang tauhan at pahiwatig.
      </p>

      <div className="border rounded-xl overflow-hidden">
        <div className="flex bg-[#d7ccc8] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-[#d7ccc8] text-center">
            BAGAY
          </div>
          <div className="flex-1 p-2 border-r border-[#d7ccc8] text-center">
            TAUHAN
          </div>
          <div className="flex-1 p-2 text-center">PAHIWATIG</div>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="flex text-xs border-t border-[#d7ccc8]">
            <div className="flex-1 p-2 border-r border-[#d7ccc8] flex items-center justify-center gap-1">
              {row.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-24 h-24 object-contain"
                  alt=""
                />
              ))}
            </div>
            <div className="flex-1 p-1 border-r border-[#d7ccc8]">
              <input
                className="w-full p-1 text-xs min-h-16 border-2 rounded"
                value={answers[row.id]?.tauhan || ""}
                onChange={(e) =>
                  setAnswers((p) => ({
                    ...p,
                    [row.id]: { ...p[row.id], tauhan: e.target.value },
                  }))
                }
              />
            </div>
            <div className="flex-1 p-1">
              <input
                className="w-full p-1 text-xs min-h-16 border-2 rounded"
                value={answers[row.id]?.pahiwatig || ""}
                onChange={(e) =>
                  setAnswers((p) => ({
                    ...p,
                    [row.id]: { ...p[row.id], pahiwatig: e.target.value },
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {saving && <span className="text-xs text-gray-500">Saving...</span>}
        {saved && <span className="text-xs text-green-600">Nai-save na!</span>}
        <button
          onClick={save}
          className="flex-1 rounded-full bg-[#3e2723] py-2"
        >
          <span className="font-bold text-white text-sm">I-save</span>
        </button>
      </div>
    </div>
  );
}
