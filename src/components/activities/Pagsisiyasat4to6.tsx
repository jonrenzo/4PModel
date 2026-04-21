"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function Pagsisiyasat4to6({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("4p_answers").select("*").eq("user_id", user.id).eq("activity_type", "pagsisiyasat").eq("chapter_range", rangeId);
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((i: any) => { map[i.question_index] = i.answer; });
          setAnswers(map);
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  // Auto-save
  useEffect(() => {
    const nonEmpty = Object.entries(answers).filter(([_, v]) => v.trim());
    if (nonEmpty.length === 0) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let idx = 1;
        for (const [key, ans] of nonEmpty) {
          await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "pagsisiyasat", chapter_range: rangeId, question_index: key, answer: ans }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
          idx++;
        }
        setSaved(true); setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers]);

  const set = (key: string, val: string) => setAnswers(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    for (const [key, ans] of Object.entries(answers)) {
      if (ans) await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "pagsisiyasat", chapter_range: rangeId, question_index: key, answer: ans }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
    }
    alert("Mahusay! Ang iyong mga sagot ay nai-save na.");
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-full bg-[#3e2723] p-1.5">
          <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="font-serif text-lg font-bold text-[#3e2723]">Pagsisiyasat</h2>
      </div>

      {/* ===== CASE 1 ===== */}
      <div className="mb-6">
        <h3 className="font-serif text-base font-bold text-[#3e2723] mb-1">Case 1: Sino ang Suspek?</h3>
        <p className="text-xs text-[#5d4037] mb-3 leading-relaxed">
          <span className="font-bold">Panuto:</span> Batay sa nabasang akda, isulat ang pangalan ng tatlong (3) tauhan na posibleng suspek o may motibo sa pagkakakulong sa ama ni Crisostomo Ibarra.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              {/* Silhouette */}
              <div className="relative w-full aspect-square rounded-lg border-2 border-[#3e2723] bg-white overflow-hidden flex items-end justify-center">
                <svg viewBox="0 0 60 60" className="w-3/4 text-[#3e2723]" fill="currentColor">
                  <circle cx="30" cy="20" r="12" />
                  <path d="M10 55 Q10 38 30 38 Q50 38 50 55" />
                </svg>
                <span className="absolute top-1 left-1/2 -translate-x-1/2 font-serif text-3xl font-bold text-white drop-shadow">?</span>
              </div>
              {/* Input */}
              <input
                type="text"
                className="w-full rounded-md border border-[#d4af37] bg-[#fef9e7] px-2 py-1.5 text-center text-xs font-bold text-[#3e2723] focus:outline-none focus:border-[#8d6e63]"
                placeholder="Pangalan..."
                value={answers[`case1_suspect${i}`] || ""}
                onChange={e => set(`case1_suspect${i}`, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== CASE 2 ===== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4 text-[#2e7d32]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <h3 className="font-serif text-base font-bold text-[#3e2723]">Case 2: Ano ang ebidensya?</h3>
        </div>
        <p className="text-xs text-[#5d4037] mb-3 leading-relaxed">
          <span className="font-bold">Panuto:</span> Mula sa mga suspek na iyong inilagay sa Case 1, ilahad mo ang motibo kung bakit sila ang iyong pinaghihinalaang nagpakulong sa ama ni Crisostomo Ibarra.
        </p>
        <div className="rounded-xl overflow-hidden border-2 border-[#3e2723]">
          {/* Table header */}
          <div className="grid grid-cols-2 bg-[#3e2723]">
            <div className="p-2 text-center text-xs font-bold text-[#e8d4b0] border-r border-[#8d6e63]">Motibo</div>
            <div className="p-2 text-center text-xs font-bold text-[#e8d4b0]">Paliwanag</div>
          </div>
          {[1, 2, 3].map((row, idx) => (
            <div key={row} className={`grid grid-cols-2 ${idx < 2 ? "border-b border-[#c4b09a]" : ""} ${idx % 2 === 0 ? "bg-[#efede6]" : "bg-[#f5ede0]"}`}>
              <div className="p-2 border-r border-[#c4b09a]">
                <input
                  type="text"
                  className="w-full border-b border-[#8d6e63] bg-transparent text-xs text-[#3e2723] focus:outline-none py-1"
                  placeholder=""
                  value={answers[`case2_motibo${row}`] || ""}
                  onChange={e => set(`case2_motibo${row}`, e.target.value)}
                />
              </div>
              <div className="p-2">
                <input
                  type="text"
                  className="w-full border-b border-[#8d6e63] bg-transparent text-xs text-[#3e2723] focus:outline-none py-1"
                  placeholder=""
                  value={answers[`case2_paliwanag${row}`] || ""}
                  onChange={e => set(`case2_paliwanag${row}`, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CASE 3 ===== */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4 text-[#3e2723]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <h3 className="font-serif text-base font-bold text-[#3e2723]">Case 3: Sino ang tunay na salarin?</h3>
        </div>
        <p className="text-xs text-[#5d4037] mb-3 leading-relaxed">
          <span className="font-bold">Panuto:</span> Sagutin ang tanong sa ibaba. Ipaliwanag at ilahad batay sa iyong pagkakaunawa sa nobela.
        </p>
        <div className="rounded-xl border-2 border-[#3e2723] bg-white p-4">
          <p className="text-xs font-bold text-[#3e2723] mb-3 leading-relaxed">
            Batay sa iyong pagsusuri sa nobela, sino ang tunay na salarin sa pagkakakulong ng ama ni Crisostomo Ibarra, at paano niya naisakatuparan ang kaniyang masamang layunin?
          </p>
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-[#c4b09a] bg-[#efede6] p-3 text-xs text-[#3e2723] focus:outline-none focus:border-[#8d6e63]"
            placeholder="Isulat ang iyong sagot dito..."
            value={answers["case3_answer"] || ""}
            onChange={e => set("case3_answer", e.target.value)}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-2 mt-4">
        {saving && <span className="text-xs text-[#8d6e63]">Sine-save...</span>}
        {saved && <span className="text-xs text-[#5d4037] font-semibold">✓ Nai-save na!</span>}
        <button onClick={handleSave} className="flex-1 rounded-full bg-[#3e2723] py-2 hover:bg-[#5d4037] transition-colors">
          <span className="font-bold text-[#e8d4b0] text-sm">I-save ang mga Sagot</span>
        </button>
      </div>
    </div>
  );
}