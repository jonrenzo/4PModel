"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

const questions = [
  {
    id: 1,
    text: "Ano ang ibig sabihin ni Tenyente Guevarra nang sabihin niyang 'mag-ingat' si Ibarra? Ipaliwanag ang kontekstong historikal at personal na dahilan kung bakit mahalaga ang babalang ito.",
  },
  {
    id: 2,
    text: "Paano naging simbolo ng kawalang-katarungan ang sinapit ni Don Rafael? Ipaliwanag batay sa pangyayari sa artilyero at sa mga paratang laban sa kanya.",
  },
  {
    id: 3,
    text: "Sa Kabanata V, bakit inihambing ang liwanag mula sa bahay ni Maria Clara sa isang 'tala sa gabing madilim'? Ano ang ipinapakitang emosyon at simbolo nito sa nararamdaman ni Ibarra?",
  },
  {
    id: 4,
    text: "Ano ang ipinapakitang katangian ni Padre Sibyla at ng batang Pransiskano sa eksena sa bahay ni Kapitan Tiyago? Ipaliwanag kung paano nagkakaiba ang kanilang kilos at inuusal batay sa inilalahad ng teksto.",
  },
  {
    id: 5,
    text: "Bakit sinasabing may 'kapangyarihan' ang pag-ibig sa pamilya at kabanata sa karakter nina Ibarra at Maria Clara sa Kabanata V-VI? Ipaliwanag kung paano ito nagdudulot ng pag-asa o pighati sa mga tauhan.",
  },
  {
    id: 6,
    text: "Ano ang ipinahihiwatig ng pagiging 'tunay na Espanyol' ni Kapitan Tiyago ayon sa kanyang asal at paniniwala? Linawin kung paano ito nagpapakita ng kalagayan ng lipunang Pilipino noong panahon ng kolonyalismo.",
  },
];

function DiceFace({ value, size = 60 }: { value: number; size?: number }) {
  const dotPositions: Record<number, string[]> = {
    1: ["center"],
    2: ["top-left", "bottom-right"],
    3: ["top-left", "center", "bottom-right"],
    4: ["top-left", "top-right", "bottom-left", "bottom-right"],
    5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
    6: [
      "top-left",
      "top-right",
      "middle-left",
      "middle-right",
      "bottom-left",
      "bottom-right",
    ],
  };

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { top: "15%", left: "15%" },
    "top-right": { top: "15%", right: "15%" },
    "middle-left": { top: "42%", left: "15%" },
    "middle-right": { top: "42%", right: "15%" },
    "bottom-left": { bottom: "15%", left: "15%" },
    "bottom-right": { bottom: "15%", right: "15%" },
    center: { top: "42%", left: "42%" },
  };

  const dots = dotPositions[value] || [];
  const dotSize = size * 0.16;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        backgroundColor: "white",
        borderRadius: 8,
        border: "2px solid #3e2723",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {dots.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: "#3e2723",
            ...positions[pos],
          }}
        />
      ))}
    </div>
  );
}

export default function Paglilinaw4to6({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [rolledNumbers, setRolledNumbers] = useState<number[]>([]);
  const [currentDiceValue, setCurrentDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
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
          setRolledNumbers(Object.keys(map).map(Number));
        }
      }
      setLoading(false);
    };
    load();
  }, [rangeId]);

  // Auto-save
  useEffect(() => {
    if (!currentAnswer.trim() || !selectedQuestion) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && selectedQuestion) {
        await supabase.from("4p_answers").upsert(
          {
            user_id: user.id,
            activity_type: "paglilinaw",
            chapter_range: rangeId,
            question_index: selectedQuestion,
            answer: currentAnswer,
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
  }, [currentAnswer, selectedQuestion]);

  const handleRollDice = () => {
    if (rolledNumbers.length >= 6) {
      alert("🎉 Tapos na! Nakumpleto mo na ang lahat ng tanong!");
      return;
    }
    if (isRolling) return;
    setIsRolling(true);

    // Animate dice values rapidly then settle
    let count = 0;
    const interval = setInterval(() => {
      setCurrentDiceValue(Math.ceil(Math.random() * 6));
      count++;
      if (count >= 10) {
        clearInterval(interval);
        const available = [1, 2, 3, 4, 5, 6].filter(
          (n) => !rolledNumbers.includes(n),
        );
        const rolled = available[Math.floor(Math.random() * available.length)];
        setCurrentDiceValue(rolled);
        setSelectedQuestion(rolled);
        setCurrentAnswer(answers[rolled] || "");
        setIsRolling(false);
        setShowModal(true);
      }
    }, 80);
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      alert("Mangyaring magsulat ng sagot.");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("4p_answers").upsert(
      {
        user_id: user.id,
        activity_type: "paglilinaw",
        chapter_range: rangeId,
        question_index: selectedQuestion!,
        answer: currentAnswer,
      },
      { onConflict: "user_id,activity_type,chapter_range,question_index" },
    );
    setAnswers((p) => ({ ...p, [selectedQuestion!]: currentAnswer }));
    if (!rolledNumbers.includes(selectedQuestion!))
      setRolledNumbers((p) => [...p, selectedQuestion!]);
    setCurrentAnswer("");
    setShowModal(false);
    setSelectedQuestion(null);
    alert("Mahusay! Nai-save na ang iyong sagot!");
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div>
      </div>
    );

  const currentQ = questions.find((q) => q.id === selectedQuestion);
  const progress = (rolledNumbers.length / 6) * 100;

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
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 5a1 1 0 012 0v3a1 1 0 01-2 0V9zm1-3a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
        <h2 className="font-poppins text-lg font-bold text-[#3e2723]">
          Paglilinaw
        </h2>
        <span className="ml-auto rounded-full bg-[#3e2723] px-3 py-1 text-sm font-bold text-[#e8d4b0]">
          {rolledNumbers.length}/6
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2.5 rounded-full bg-[#c4b09a] overflow-hidden">
          <div
            className="h-full bg-[#5d4037] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#8d6e63] mt-1">
          {6 - rolledNumbers.length} tanong ang natitira
        </p>
      </div>

      {/* Instructions */}
      <div className="mb-4 rounded-xl border border-[#c4b09a] bg-[#efede6] p-3">
        <p className="text-xs text-[#5d4037]">
          <span className="font-bold">Panuto:</span> Pindutin ang dice para
          gumulong at makakuha ng alinmang numero. Sagutin ang tanong na katapat
          ng numerong lumabas!
        </p>
      </div>

      {/* Dice */}
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <motion.button
          onClick={handleRollDice}
          disabled={isRolling || rolledNumbers.length >= 6}
          whileTap={{ scale: 0.92 }}
          animate={isRolling ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="cursor-pointer disabled:cursor-default"
        >
          <DiceFace value={currentDiceValue} size={120} />
        </motion.button>
        <p className="text-sm font-bold text-[#3e2723]">
          {rolledNumbers.length >= 6
            ? "🎉 Tapos na!"
            : isRolling
              ? "Nag-ro-roll..."
              : "Pindutin ang dice para gumulong!"}
        </p>
      </div>

      {/* Completed dice */}
      {rolledNumbers.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-bold text-[#5d4037] mb-2">
            ✅ Nasagot na ({rolledNumbers.length}):
          </p>
          <div className="flex flex-wrap gap-3">
            {rolledNumbers
              .sort((a, b) => a - b)
              .map((num) => (
                <div key={num} className="flex flex-col items-center gap-1">
                  <DiceFace value={num} size={48} />
                  <span className="text-xs font-bold text-[#5d4037]">✓</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && currentQ && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="bg-[#3e2723] p-4 flex flex-col items-center gap-3">
                <DiceFace value={selectedQuestion || 1} size={72} />
                <h3 className="font-bold text-white text-base">
                  Tanong #{selectedQuestion}
                </h3>
              </div>
              <div className="p-4">
                {/* Question */}
                <div className="mb-3 rounded-xl border-2 border-[#d4af37] bg-[#fff8e1] p-3">
                  <p className="text-xs font-bold text-[#92400e] mb-1">
                    📋 Tanong:
                  </p>
                  <p className="text-xs text-[#5d4037] leading-relaxed">
                    {currentQ.text}
                  </p>
                </div>
                {/* Answer */}
                <p className="text-xs font-bold text-[#3e2723] mb-2">
                  ✍️ Iyong Sagot:
                </p>
                <textarea
                  className="w-full min-h-[100px] rounded-xl border border-[#c4b09a] bg-[#efede6] p-3 text-xs text-[#3e2723] focus:outline-none focus:border-[#8d6e63] mb-3"
                  placeholder="Isulat ang iyong sagot dito..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  {saving && (
                    <span className="text-xs text-[#8d6e63]">Sine-save...</span>
                  )}
                  {saved && (
                    <span className="text-xs text-[#5d4037] font-semibold">
                      ✓ Nai-save!
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedQuestion(null);
                      setCurrentAnswer("");
                    }}
                    className="flex-1 py-2 rounded-full border border-[#8d6e63] text-xs font-bold text-[#5d4037] hover:bg-[#d7ccc8] transition-colors"
                  >
                    Isara
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-2 rounded-full bg-[#3e2723] text-xs font-bold text-[#e8d4b0] hover:bg-[#5d4037] transition-colors"
                  >
                    I-Submit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
