"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";

const questions = [
  {
    id: 1,
    question:
      "Batay sa mga naging pahayag at kilos ng mga panauhin. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan?",
  },
  {
    id: 2,
    question:
      "Paano inilarawan sa teksto ang pagtrato kay Ibarra? Ano ang ipinahihiwatig nito?",
  },
  {
    id: 3,
    question:
      "Ano-ano ang mga ginawa ng mga prayle sa nobela? Makatarungan ba?",
  },
  {
    id: 4,
    question: "Paano nahahayag ang tunay na pagkatao ni Ibarra sa Kabanata 2?",
  },
  {
    id: 5,
    question:
      "Paano masasabing ang handaan ay isang salamin ng lipunang Pilipino?",
  },
];

export default function Pagsisiyasat1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: string }>(
    {},
  );
  const [completedKeys, setCompletedKeys] = useState<number[]>([]);
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
          .eq("activity_type", "pagsisiyasat")
          .eq("chapter_range", rangeId);
        if (data) {
          const map: any = {};
          data.forEach((i: any) => {
            map[i.question_index] = i.answer;
          });
          setSavedAnswers(map);
          setCompletedKeys(Object.keys(map).map(Number));
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  // Auto-save effect
  useEffect(() => {
    if (!currentAnswer.trim() || !selectedKey) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && selectedKey) {
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "pagsisiyasat",
            chapter_range: rangeId,
            question_index: selectedKey,
            answer: currentAnswer,
          },
          {
            onConflict: "user_id,activity_type,chapter_range,question_index",
          },
        );
        setSavedAnswers((p: any) => ({ ...p, [selectedKey]: currentAnswer }));
        if (!completedKeys.includes(selectedKey))
          setCompletedKeys((p: any) => [...p, selectedKey]);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentAnswer, selectedKey]);

  const submit = async () => {
    if (!currentAnswer.trim()) return alert("Sumulat ng sagot");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("4p_answers").upsert(
      {
        user_id: user.id,
        activity_type: "pagsisiyasat",
        chapter_range: rangeId,
        question_index: selectedKey!,
        answer: currentAnswer,
      },
      { onConflict: "user_id,activity_type,chapter_range,question_index" },
    );
    setSavedAnswers((p: any) => ({ ...p, [selectedKey!]: currentAnswer }));
    if (!completedKeys.includes(selectedKey!))
      setCompletedKeys((p: any) => [...p, selectedKey!]);
    setCurrentAnswer("");
    setSelectedKey(null);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#3e2723] p-1.5">
            <svg
              className="w-4 h-4 text-[#d4af37]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-poppins text-lg font-bold text-[#3e2723]">
            Pagsisiyasat
          </h2>
        </div>
        <div className="rounded-full bg-[#3e2723] px-3 py-1">
          <span className="text-sm font-bold text-white">
            {completedKeys.length}/{questions.length}
          </span>
        </div>
      </div>

      <p className="mb-3 text-xs text-[#5d4037]">
        Pumili ng numero para sagutan ang tanong.
      </p>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => {
              setSelectedKey(q.id);
              setCurrentAnswer(savedAnswers[q.id] || "");
            }}
            className={`py-3 rounded-xl font-bold text-lg transition-all shadow-sm border-b-4 ${
              completedKeys.includes(q.id)
                ? "bg-[#5d4037] border-[#3e2723] text-[#d4af37]"
                : selectedKey === q.id
                  ? "bg-[#6d4c41] border-[#3e2723] text-white scale-95"
                  : "bg-[#8d6e63] border-[#5d4037] text-[#efede6] hover:bg-[#7d5e53]"
            }`}
          >
            {completedKeys.includes(q.id) ? "✓" : i + 1}
          </button>
        ))}
      </div>

      {/* Answer Area */}
      {selectedKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[#8d6e63] bg-[#efede6] p-3"
        >
          <p className="mb-1 text-xs font-bold text-[#3e2723]">
            Tanong {selectedKey}:
          </p>
          <p className="mb-3 text-xs text-[#5d4037] leading-relaxed">
            {questions.find((q) => q.id === selectedKey)?.question}
          </p>
          <textarea
            className="w-full min-h-[100px] rounded-lg border border-[#c4b09a] bg-white p-2 text-xs text-[#3e2723] focus:outline-none focus:border-[#8d6e63]"
            placeholder="Isulat ang sagot..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
          />
          <div className="flex gap-2 mt-2 items-center">
            {saving && (
              <span className="text-xs text-[#8d6e63]">Sine-save...</span>
            )}
            {saved && (
              <span className="text-xs text-[#5d4037] font-semibold">
                ✓ Nai-save na!
              </span>
            )}
            <button
              onClick={() => setSelectedKey(null)}
              className="flex-1 py-2 rounded-full border border-[#8d6e63] text-xs font-bold text-[#5d4037] hover:bg-[#d7ccc8] transition-colors"
            >
              Kanselahin
            </button>
            <button
              onClick={submit}
              className="flex-1 py-2 rounded-full bg-[#3e2723] text-xs font-bold text-[#e8d4b0] hover:bg-[#5d4037] transition-colors"
            >
              I-submit
            </button>
          </div>
        </motion.div>
      )}

      {/* Completed summary */}
      {completedKeys.length > 0 && !selectedKey && (
        <div className="mt-3 p-3 rounded-xl bg-[#efede6] border border-[#8d6e63]">
          <p className="text-xs font-bold text-[#3e2723]">
            ✓ Nasagot na: {completedKeys.sort((a, b) => a - b).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
