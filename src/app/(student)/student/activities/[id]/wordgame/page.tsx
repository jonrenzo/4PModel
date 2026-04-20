"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCcw, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase";

const words = [
  "IBARRA",
  "MARIA",
  "DAMASO",
  "SIBYLA",
  "KAPITAN",
  "TALAYAN",
  "HANDOGAN",
  "EREHE",
  "PILIBUSTERO",
  "FONDA",
  "KALESA",
  "ORKESTRA",
  "KABANALAN",
];

const activityInfo: Record<number, { chapters: number[] }> = {
  1: { chapters: [1, 2, 3] },
  2: { chapters: [4, 5, 6] },
};

export default function WordGamePage() {
  const params = useParams();
  const id = Number(params.id);
  const supabase = createClient();
  
  const [currentWord, setCurrentWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    if (words.length > 0) {
      scrambleWord(words[Math.floor(Math.random() * words.length)]);
    }
  }, []);

  const scrambleWord = (word: string) => {
    setCurrentWord(word);
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const scrambledWord = arr.join("");
    if (scrambledWord === word && word.length > 1) {
      scrambleWord(word);
    } else {
      setScrambled(scrambledWord);
    }
    setUserInput("");
    setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempts((prev) => prev + 1);
    
    if (userInput.toUpperCase().replace(/\s/g, "") === currentWord.replace(/\s/g, "")) {
      setFeedback("correct");
      setScore((prev) => prev + 1);
      setTimeout(() => {
        scrambleWord(words[Math.floor(Math.random() * words.length)]);
      }, 1500);
    } else {
      setFeedback("incorrect");
    }
  };

  if (!activityInfo[id]) {
    return (
      <div className="p-6">
        <p className="text-white">Activity not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      <div className="flex items-center mb-6">
        <Link
          href={`/student/activities/${id}`}
          className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="ml-2 text-lg font-bold text-[#e8d4b0]">Larong Pagpapaliit</h1>
      </div>

      <div className="bg-[#efede6] rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-[#5d4037]">Iskor</p>
            <p className="text-2xl font-bold text-[#3e2723]">{score}</p>
          </div>
          <div>
            <p className="text-xs text-[#5d4037]">Mga Pagsubok</p>
            <p className="text-2xl font-bold text-[#3e2723]">{attempts}</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xs text-[#5d4037] mb-2">Ibuo ang salita</p>
          <div className="bg-[#3e2723] text-white py-4 rounded-lg text-2xl font-bold tracking-widest">
            {scrambled}
          </div>
        </div>

        {feedback && (
          <div
            className={`flex items-center justify-center py-2 rounded-lg mb-4 ${
              feedback === "correct" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {feedback === "correct" ? (
              <Check size={20} className="text-green-600 mr-2" />
            ) : (
              <X size={20} className="text-red-600 mr-2" />
            )}
            <span
              className={
                feedback === "correct" ? "text-green-700" : "text-red-700"
              }
            >
              {feedback === "correct" ? "Tama!" : "Subukan muli!"}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Isulat ang sagot..."
            className="w-full rounded-lg border-2 border-[#3e2723] bg-white px-5 py-4 text-lg text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#f5c170] py-4 font-bold text-[#3e2723] hover:bg-[#e5b160]"
            >
              Sagutin
            </button>
            <button
              type="button"
              onClick={() => scrambleWord(words[Math.floor(Math.random() * words.length)])}
              className="rounded-lg bg-[#8d6e63] px-4 text-white hover:bg-[#7a5d53]"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}