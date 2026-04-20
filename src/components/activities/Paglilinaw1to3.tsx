"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const characters = [
  { id: 1, image: "/tiago.png", question: "Sang-ayon ka ba na si Kapitan Tiago ay isang oportunista?" },
  { id: 2, image: "/ibarra.png", question: "Ang kawalan ba ng reaksyon ni Ibarra ay tanda ng kanyang pagiging edukado?" },
  { id: 3, image: "/hernando.png", question: "Sang-ayon ka ba kay Padre Sibyla na palihim niyang pinupuna si Ibarra?" },
  { id: 4, image: "/don.png", question: "Paano ang matibay na prinsipyo ni Don Rafael ang naging mitsa ng kanyang tunggalian?" },
];

export default function Paglilinaw1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("4p_answers").select("*").eq("user_id", user.id).eq("activity_type", "paglilinaw").eq("chapter_range", rangeId);
        if (data) {
          const map: Record<number, string> = {};
          data.forEach((i: any) => { map[i.question_index] = i.answer; });
          setAnswers(map);
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    for (const char of characters) {
      if (answers[char.id]) {
        await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "paglilinaw", chapter_range: rangeId, question_index: char.id, answer: answers[char.id] }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
      }
    }
    alert("Mahusay! Nai-save na.");
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#3e2723] p-1.5"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v2a1 1 0 11-2 0v-2H6a1 1 0 110-2h2V6a1 1 0 012 0v2h2a1 1 0 110 2z" /></svg></div>
        <h2 className="font-serif text-lg font-bold text-[#3e2723]">Paglilinaw</h2>
      </div>

      <p className="mb-3 text-xs text-[#5d4037]">Tukuyin ang katangian ng bawat tauhan at bigyang katuwiran.</p>

      <div className="space-y-3">
        {characters.map((char) => (
          <div key={char.id} className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
            <img src={char.image} alt="char" className="w-16 h-16 rounded-lg object-cover border-2 border-[#d4af37]" />
            <div className="flex-1">
              <p className="text-xs text-[#5d4037] mb-1">{char.question}</p>
              <textarea className="w-full min-h-[50px] text-xs border rounded-lg p-2" rows={2} onChange={(e) => setAnswers((p) => ({ ...p, [char.id]: e.target.value }))} value={answers[char.id] || ""} placeholder="Sagutin..." />
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} className="mt-4 w-full rounded-full bg-[#3e2723] py-2"><span className="font-bold text-white text-sm">I-save ang mga Sagot</span></button>
    </div>
  );
}