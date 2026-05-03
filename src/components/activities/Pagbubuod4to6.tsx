"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

const rubric = [
  {
    label: "Pagkilala sa Pangunahing Ideya",
    label_inst:
      "Malinaw na naipakita ang pangunahing mensahe ng kabanata batay sa ibinigay na emoji; hindi nalilihis sa sentral na tema.",
    points: "5 puntos",
  },
  {
    label: "Pagluhanay ng Mahahalagang Pangyayari",
    label_inst:
      "Kumpleto at lohikal ang pagkakasunod-sunod ng mahahalagang pangyayari; walang labis na detalye.",
    points: "5 puntos",
  },
  {
    label: "Pagiging Komprehensibo",
    label_inst:
      "Napanatili ang kabuuang saysay ng kabanata sa pinaikling paraan; hindi sumobra sa detalye at hindi naglalaman ng personal na opinyon.",
    points: "5 puntos",
  },
  {
    label: "Kaayusan at Kalinawan",
    label_inst:
      "Malinaw, organisado, at madaling basahin ang buod; may maayos na daloy ng ideya.",
    points: "5 puntos",
  },
  {
    label: "Gamit ng Wika",
    label_inst:
      "Wastong baybay, bantas, at gramatika; malinaw ang mga pangungusap.",
    points: "5 puntos",
  },
];

export default function Pagbubuod4to6({ rangeId }: { rangeId: string }) {
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

  // Auto-save effect
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
            className="w-4 h-4 text-white"
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
        <span className="font-bold">Panuto:</span> Basahing mabuti ang
        itinakdang kabanata mula sa Nobelang Noli Me Tangere. Gamit ang mga
        emoji, sumulat ng isang maikling buod na binubuo ng apat (4) hanggang
        anim (6) na pangungusap.
        <br />
        <br /> Tiyaking malinaw na nakasaad ang pangunahing ideya, mahahalagang
        pangyayari, at tamang pagkakasunod-sunod ng mga ito. Iwasan ang
        paglalagay ng labis na detalye, sariling opinyon, o komentaryo; ibatay
        lamang ang sagot sa mismong nilalaman ng kabanata.
      </p>
      <textarea
        className="w-full min-h-30 rounded-xl border-2 border-black p-3 text-xs mb-3"
        placeholder="📜🏠😟👨‍🦳💬🔥😮👥"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <div className="border rounded-xl overflow-hidden mb-3">
        <div className="flex bg-[#d7ccc8] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-black">Pamantayan</div>
          <div className="w-16 p-2 text-center">Puntos</div>
        </div>
        {rubric.map((row, i) => (
          <div key={i} className="flex text-xs border-t border-black">
            <div className="flex-1 p-2 border-r border-black font-bold">
              {row.label} <span className="font-light">- {row.label_inst}</span>
            </div>
            <div className="w-16 p-2 text-center bg-[#efede6]">
              {row.points}
            </div>
          </div>
        ))}
        <div className="flex bg-[#d7ccc8] text-xs font-bold">
          <div className="flex-1 p-2 border-r border-black">Kabuuan</div>
          <div className="w-16 p-2 text-center">25 puntos</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {saving && <span className="text-xs text-gray-500">Saving...</span>}
        {saved && <span className="text-xs text-green-600">Nai-save na!</span>}
        <button
          onClick={save}
          className="flex-1 rounded-full bg-[#3e2723] py-2"
        >
          <span className="font-bold text-white text-sm">Ipasa ang Buod</span>
        </button>
      </div>
    </div>
  );
}
