"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const rubric = [
  { label: "Pagkilala sa Pangunahing Ideya", points: "5" },
  { label: "Pagluhanay ng Mahahalagang Pangyayari", points: "5" },
  { label: "Pagiging Komprehensibo", points: "5" },
  { label: "Kaayusan at Kalinawan", points: "5" },
  { label: "Gamit ng Wika", points: "5" },
];

export default function Pagbubuod4to6({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("4p_answers").select("answer").eq("user_id", user.id).eq("activity_type", "pagbubuod").eq("chapter_range", rangeId).single();
        if (data) setSummary(data.answer || "");
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "pagbubuod", chapter_range: rangeId, question_index: 1, answer: summary }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
    alert("Mahusay! Nai-save na.");
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#3e2723] p-1.5"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg></div>
        <h2 className="font-serif text-lg font-bold text-[#3e2723]">Pagbubuod</h2>
      </div>
      <p className="mb-3 text-xs text-[#5d4037]">Sumulat ng buod (4-6 pangungusap) mula sa Kabanata 4-6. 📜🏠😲🤫</p>
      <textarea className="w-full min-h-[120px] rounded-xl border border-gray-300 p-3 text-xs mb-3" placeholder="Simulan dito..." value={summary} onChange={(e) => setSummary(e.target.value)} />
      
      <div className="border rounded-xl overflow-hidden mb-3">
        <div className="flex bg-[#d7ccc8] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-black">Pamantayan</div>
          <div className="w-16 p-2 text-center">Puntos</div>
        </div>
        {rubric.map((row, i) => (
          <div key={i} className="flex text-xs border-t border-black">
            <div className="flex-1 p-2 border-r border-black">{row.label}</div>
            <div className="w-16 p-2 text-center bg-[#efede6]">{row.points}</div>
          </div>
        ))}
        <div className="flex bg-[#d7ccc8] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-black">Kabuuan</div>
          <div className="w-16 p-2 text-center">25</div>
        </div>
      </div>
      <button onClick={save} className="w-full rounded-full bg-[#3e2723] py-2"><span className="font-bold text-white text-sm">I-save ang Buod</span></button>
    </div>
  );
}