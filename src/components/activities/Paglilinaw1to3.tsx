"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const characters = [
  {
    id: 1,
    image: "/tiago.png",
    question: "Sang-ayon ka ba na si Kapitan Tiago ay isang oportunista?",
  },
  {
    id: 2,
    image: "/ibarra.png",
    question:
      "Ang kawalan ba ng reaksyon ni Ibarra ay tanda ng kanyang pagiging edukado?",
  },
  {
    id: 3,
    image: "/hernando.png",
    question:
      "Sang-ayon ka ba kay Padre Sibyla na palihim niyang pinupuna si Ibarra?",
  },
  {
    id: 4,
    image: "/don.png",
    question:
      "Paano ang matibay na prinsipyo ni Don Rafael ang naging mitsa ng kanyang tunggalian?",
  },
];

export default function Paglilinaw1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});
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
          .eq("activity_type", "paglilinaw")
          .eq("chapter_range", rangeId);
        if (data) {
          const map: Record<number, string> = {};
          data.forEach((i: any) => {
            map[i.question_index] = i.answer;
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
    const nonEmpty = Object.entries(answers).filter(([_, v]) => v.trim());
    if (nonEmpty.length === 0) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        for (const [id, ans] of nonEmpty) {
          await supabase.from("4p_answers").upsert(
            {
              user_id: user.id,
              activity_type: "paglilinaw",
              chapter_range: rangeId,
              question_index: Number(id),
              answer: ans,
            },
            {
              onConflict: "user_id,activity_type,chapter_range,question_index",
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
    for (const char of characters) {
      if (answers[char.id]) {
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "paglilinaw",
            chapter_range: rangeId,
            question_index: char.id,
            answer: answers[char.id],
          },
          {
            onConflict: "user_id,activity_type,chapter_range,question_index",
          },
        );
      }
    }
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
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#3e2723] p-1.5">
          <svg
            className="w-4 h-4 text-[#d4af37]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="font-poppins text-lg font-bold text-[#3e2723]">
          Paglilinaw
        </h2>
      </div>

      <p className="mb-3 text-base text-[#5d4037]">
        Tukuyin ang katangian ng bawat tauhan at bigyang katuwiran.
      </p>

      <div className="space-y-3">
        {characters.map((char) => (
          <div
            key={char.id}
            className="flex gap-3 bg-[#efede6] border border-[#c4b09a] p-3 rounded-xl shadow-sm"
          >
            <img
              src={char.image}
              alt="char"
              className="w-32 h-32 rounded-lg object-fill border-2 border-[#d4af37] shrink-0 "
            />
            <div className="flex-1 min-w-0">
              <p className="text-lg text-[#3e2723] font-medium mb-2 leading-relaxed">
                {char.question}
              </p>
              <textarea
                className="w-full min-h-24 text-base border border-[#c4b09a] rounded-lg p-2 bg-white text-[#3e2723] focus:outline-none focus:border-[#8d6e63] resize-none"
                rows={2}
                onChange={(e) =>
                  setAnswers((p) => ({ ...p, [char.id]: e.target.value }))
                }
                value={answers[char.id] || ""}
                placeholder="Sagutin..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
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
            Ipasa ang mga Sagot
          </span>
        </button>
      </div>
    </div>
  );
}
