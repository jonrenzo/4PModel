"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";

const questions = [
  { id: 1, question: "Batay sa mga naging pahayag at kilos ng mga panauhin. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan?" },
  { id: 2, question: "Paano inilarawan sa teksto ang pagtrato kay Ibarra? Ano ang ipinahihiwatig nito?" },
  { id: 3, question: "Ano-ano ang mga ginawa ng mga prayle sa nobela? Makatarungan ba?" },
  { id: 4, question: "Paano nahahayag ang tunay na pagkatao ni Ibarra sa Kabanata 2?" },
  { id: 5, question: "Paano masasabing ang handaan ay isang salamin ng lipunang Pilipino?" },
];

export default function Pagsisiyasat1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: string }>({});
  const [completedKeys, setCompletedKeys] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("4p_answers").select("*").eq("user_id", user.id).eq("activity_type", "pagsisiyasat").eq("chapter_range", rangeId);
        if (data) {
          const map: any = {}; data.forEach((i: any) => { map[i.question_index] = i.answer; });
          setSavedAnswers(map);
          setCompletedKeys(Object.keys(map).map(Number));
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  const submit = async () => {
    if (!currentAnswer.trim()) return alert("Sumulat ng sagot");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "pagsisiyasat", chapter_range: rangeId, question_index: selectedKey!, answer: currentAnswer }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
    setSavedAnswers((p: any) => ({ ...p, [selectedKey!]: currentAnswer }));
    if (!completedKeys.includes(selectedKey!)) setCompletedKeys((p: any) => [...p, selectedKey!]);
    setCurrentAnswer(""); setSelectedKey(null);
    alert("Nai-save!");
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#78350f] p-1.5"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 002-2V6a2 2 0 10-4 0v4a2 2 0 002 2zm0-3a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" /></svg></div>
          <h2 className="font-serif text-lg font-bold text-[#3e2723]">Pagsisiyasat</h2>
        </div>
        <div className="rounded-full bg-[#78350f] px-3 py-1"><span className="text-sm font-bold text-white">{completedKeys.length}/{questions.length}</span></div>
      </div>

      <p className="mb-3 text-xs text-[#5d4037]">Pumili ng numero para sagutan ang tanong.</p>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((q, i) => (
          <button key={q.id} onClick={() => { setSelectedKey(q.id); setCurrentAnswer(savedAnswers[q.id] || ""); }}
            className={`py-3 rounded-lg font-bold text-lg ${completedKeys.includes(q.id) ? "bg-green-500 text-white" : "bg-yellow-400 text-[#78350f]"}`}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* Answer Area */}
      {selectedKey && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border-2 border-yellow-500 bg-yellow-50 p-3">
          <p className="mb-2 text-xs font-bold text-[#92400e]">Tanong {selectedKey}:</p>
          <p className="mb-3 text-xs text-[#78350f]">{questions.find(q => q.id === selectedKey)?.question}</p>
          <textarea className="w-full min-h-[100px] rounded-lg border border-[#d7ccc8] p-2 text-xs" placeholder="Isulat ang sagot..." value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setSelectedKey(null)} className="flex-1 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-600">Kanselahin</button>
            <button onClick={submit} className="flex-1 py-2 rounded-lg bg-[#f59e0b] text-xs font-bold text-white">I-submit</button>
          </div>
        </motion.div>
      )}

      {/* Completed */}
      {completedKeys.length > 0 && !selectedKey && (
        <div className="mt-3 p-3 rounded-lg bg-green-50">
          <p className="text-xs font-bold text-green-700">Nasagot: {completedKeys.join(", ")}</p>
        </div>
      )}
    </div>
  );
}