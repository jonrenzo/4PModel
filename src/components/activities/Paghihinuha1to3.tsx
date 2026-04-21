"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

interface Character {
  id: number;
  name: string;
  question: string;
  image: string;
}

const characters: Character[] = [
  { id: 1, name: "Crisostomo Ibarra", question: "Batay sa kanyang kasuotan at ekspresyon, paano mo ilalarawan ang kanyang papel sa lipunang ginagalawan niya?", image: "/ibarra.png" },
  { id: 2, name: "Maria Clara", question: "Ano ang ipinapakita ng kanyang postura kung siya ba ay mahinhin, mahiyain, o matapang? Ipaliwanag.", image: "/maria.png" },
  { id: 3, name: "Padre Damaso", question: "Tingnan ang ekspresyon ng pari. Sa iyong palagay, siya ba ay isang prayleng mapagpakumbaba o isang taong madaling magalit? Bakit?", image: "/damaso.png" },
  { id: 4, name: "Donya Pia Alba", question: "Batay sa kanyang postura, paano mo ilalarawan ang katangian na namamayani sa kanya?", image: "/pia.png" },
  { id: 5, name: "Kapitan Tiyago", question: "Ano ang maaaring ipahiwatig ng kanyang ekspresyon sa mata o mukha tungkol sa kanyang pag-iisip o damdamin?", image: "/tiago.png" },
  { id: 6, name: "Tiya Isabel", question: "Batay sa kaniyang pananamit, anong hinuha ang mabubuo mo tungkol sa kaniyang katayuan sa lipunan?", image: "/tiya.png" },
];

export default function Paghihinuha1to3({ rangeId }: { rangeId: string }) {
  const supabase = createClient();
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>(characters);
  const [clawedCharacter, setClawedCharacter] = useState<Character | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isClawing, setIsClawing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [clawY, setClawY] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const activityId = `paghihinuha-${rangeId}`;

  // Auto-save effect
  useEffect(() => {
    if (!currentAnswer.trim() || !clawedCharacter) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user && clawedCharacter) {
        await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "paghihinuha", chapter_range: rangeId, question_index: clawedCharacter.id, answer: currentAnswer }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
        setSavedAnswers((prev) => ({ ...prev, [clawedCharacter.id]: currentAnswer }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
      setSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentAnswer, clawedCharacter]);

  useEffect(() => { loadProgress(); }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: answers } = await supabase.from("4p_answers").select("*").eq("user_id", user.id).eq("activity_type", "paghihinuha").eq("chapter_range", rangeId);
      if (answers) {
        const answersMap: { [key: number]: string } = {};
        answers.forEach((item) => { answersMap[item.question_index] = item.answer; });
        setSavedAnswers(answersMap);
        const completedIds = Object.keys(answersMap).map(Number);
        const remaining = characters.filter((c) => !completedIds.includes(c.id));
        setAvailableCharacters(remaining);
        setCompletedCount(completedIds.length);
      }
    } catch (error) { console.error("Error:", error); }
    finally { setLoading(false); }
  };

  const handleClawClick = () => {
    if (availableCharacters.length === 0) { alert("Tapos na!"); return; }
    if (isClawing) return;
    setIsClawing(true);
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const selected = availableCharacters[randomIndex];
    
    setTimeout(() => { setClawY(120); }, 300);
    setTimeout(() => {
      setClawedCharacter(selected);
      setIsClawing(false);
      setShowQuestionModal(true);
      setClawY(0);
    }, 1500);
  };

  const handleSaveAnswer = async () => {
    if (!currentAnswer.trim()) { alert("Sagutin ang tanong."); return; }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("4p_answers").upsert({ user_id: user.id, activity_type: "paghihinuha", chapter_range: rangeId, question_index: clawedCharacter!.id, answer: currentAnswer }, { onConflict: "user_id,activity_type,chapter_range,question_index" });
      setSavedAnswers((prev) => ({ ...prev, [clawedCharacter!.id]: currentAnswer }));
      setCompletedCount((prev) => prev + 1);
      setAvailableCharacters((prev) => prev.filter((c) => c.id !== clawedCharacter!.id));
      setCurrentAnswer(""); setShowQuestionModal(false); setClawedCharacter(null);
      alert(completedCount + 1 === characters.length ? "Mahusay! Tapos na!" : "Nai-save na!");
    } catch (error) { alert("Error saving"); }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#3e2723] p-1.5"><Search size={14} className="text-[#d4af37]" /></div>
          <h2 className="font-serif text-lg font-bold text-[#3e2723]">Paghihinuha</h2>
        </div>
        <div className="rounded-full bg-[#3e2723] px-3 py-1"><span className="text-sm font-bold text-white">{completedCount}/{characters.length}</span></div>
      </div>

      {/* Instructions */}
      <div className="mb-3 rounded-xl border border-[#d4af37] bg-[#fff8e1] p-3">
        <p className="text-xs text-[#5d4037]">Pindutin ang pulang button para kunin ang karakter. Magbigay ng hinuha tungkol sa kanyang papel sa nobela.</p>
      </div>

      {/* Claw Machine */}
      <div className="rounded-2xl bg-gradient-to-b from-[#8d6e63] to-[#6d4c41] p-3 shadow-lg">
        <div className="rounded-xl border-2 border-[#d4af37] bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb] relative overflow-hidden" style={{ height: 200 }}>
          {/* Claw */}
          <motion.div className="absolute left-1/2 top-0 -translate-x-1/2" animate={{ y: clawY }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <div className="w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-400 mx-auto" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-gray-400 to-gray-600 flex items-center justify-center mx-auto"><Search size={16} className="text-gray-700" /></div>
          </motion.div>

          {/* Characters */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-2 flex-wrap">
            {availableCharacters.slice(0, 6).map((char) => (
              <div key={char.id} className="w-10 h-10 rounded-full border-2 border-white shadow overflow-hidden bg-gray-200">
                <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mt-3 flex justify-center">
          <motion.button onClick={handleClawClick} disabled={isClawing || availableCharacters.length === 0}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl ${isClawing ? "bg-orange-500" : "bg-red-500 hover:bg-red-600"}`}
            whileTap={{ scale: 0.95 }}>
            {isClawing ? <div className="animate-spin"><Search size={24} className="text-white" /></div> : <><Search size={24} className="text-white" /><span className="text-xs text-white font-bold">{availableCharacters.length === 0 ? "TAPOS" : "SIMULA"}</span></>}
          </motion.button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showQuestionModal && clawedCharacter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-b from-[#f5e6d3] to-white p-4 text-center">
                <img src={clawedCharacter.image} alt={clawedCharacter.name} className="w-20 h-20 rounded-full border-4 border-[#d4af37] mx-auto object-cover" />
                <h3 className="mt-2 font-serif text-lg font-bold text-[#3e2723]">{clawedCharacter.name}</h3>
              </div>
              <div className="p-4">
                <p className="mb-3 text-xs text-[#5d4037]">{clawedCharacter.question}</p>
                <textarea className="w-full min-h-[80px] rounded-xl border border-[#d7ccc8] p-3 text-xs" placeholder="Isulat ang sagot..." value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)} />
                <div className="flex gap-2 mt-3">
                  {saving && <span className="text-xs text-gray-500">Saving...</span>}
                  {saved && <span className="text-xs text-green-600">Nai-save na!</span>}
                  <button onClick={() => { setShowQuestionModal(false); setClawedCharacter(null); }} className="flex-1 py-2 rounded-full border border-gray-300 text-sm font-bold text-gray-600">Laktawan</button>
                  <button onClick={handleSaveAnswer} className="flex-1 py-2 rounded-full bg-[#3e2723] text-sm font-bold text-white">I-save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Search({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
}