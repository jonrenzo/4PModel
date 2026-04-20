"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import { chaptersData } from "@/lib/chaptersData";
import { createClient } from "@/lib/supabase";

export default function ChapterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const chapter = chaptersData.find((c) => c.id === id);
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"talasalitaan" | "nobela">("talasalitaan");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [mindMapInputs, setMindMapInputs] = useState<string[]>(["", "", "", ""]);
  const [punanAnswers, setPunanAnswers] = useState<{ [key: number]: string }>({});
  const [punanInputs, setPunanInputs] = useState<{ [key: string]: string }>({});
  const [matches, setMatches] = useState<{ [key: number]: string }>({});
  const [activeChoice, setActiveChoice] = useState<string | null>(null);
  const [connectedPairs, setConnectedPairs] = useState<{ [key: number]: string }>({});
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (activeTab === "nobela" && user) {
      const markAsRead = async () => {
        await supabase.from("chapter_progress").upsert(
          {
            user_id: user.id,
            chapter_id: id,
            is_read: true,
            read_at: new Date().toISOString(),
          },
          { onConflict: "user_id,chapter_id" }
        );
      };
      markAsRead();
    }
  }, [activeTab, id, user, supabase]);

  useEffect(() => {
    const loadAnswers = async () => {
      if (!user || !chapter) return;
      const { data } = await supabase
        .from("talasalitaan_answers")
        .select("*")
        .eq("user_id", user.id)
        .eq("chapter_id", id)
        .eq("quiz_type", chapter.quizType)
        .single();

      if (data?.answers) {
        switch (chapter.quizType) {
          case "multiple-choice":
            setSelectedAnswers(data.answers);
            break;
          case "mind-map":
            setMindMapInputs(Object.values(data.answers));
            break;
          case "punan-mo":
            setPunanAnswers(data.answers);
            break;
          case "matching":
            setMatches(data.answers);
            break;
          case "line-connect":
            setConnectedPairs(data.answers);
            break;
        }
      }
    };
    loadAnswers();
  }, [id, chapter, user]);

  const handleSave = async () => {
    if (!user || !chapter) return;
    let answersToSave;
    switch (chapter.quizType) {
      case "multiple-choice":
        answersToSave = selectedAnswers;
        break;
      case "mind-map":
        answersToSave = mindMapInputs;
        break;
      case "punan-mo":
        answersToSave = punanAnswers;
        break;
      case "matching":
        answersToSave = matches;
        break;
      case "line-connect":
        answersToSave = connectedPairs;
        break;
      default:
        return;
    }
    await supabase.from("talasalitaan_answers").upsert(
      {
        user_id: user.id,
        chapter_id: id,
        quiz_type: chapter.quizType,
        answers: answersToSave,
      },
      { onConflict: "user_id,chapter_id,quiz_type" }
    );
    alert("Sagot Nai-save!");
  };

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleMindMapChange = (text: string, index: number) => {
    const newInputs = [...mindMapInputs];
    newInputs[index] = text;
    setMindMapInputs(newInputs);
  };

  const handlePunanTextChange = (text: string, questionId: number, charIndex: number, clues: string[]) => {
    const key = `q${questionId}-${charIndex}`;
    const upperText = text.toUpperCase();
    const newPunanInputs = { ...punanInputs, [key]: upperText };
    setPunanInputs(newPunanInputs);

    let completeWord = "";
    clues.forEach((char, idx) => {
      if (char !== "") {
        completeWord += char;
      } else {
        const inputKey = `q${questionId}-${idx}`;
        completeWord += newPunanInputs[inputKey] || "_";
      }
    });
    setPunanAnswers((prev) => ({ ...prev, [questionId]: completeWord }));
  };

  const handleChoiceClick = (choice: string) => {
    setActiveChoice(choice);
  };

  const handleLineClick = (questionId: number) => {
    if (activeChoice) {
      setMatches((prev) => ({ ...prev, [questionId]: activeChoice }));
      setActiveChoice(null);
    } else if (matches[questionId]) {
      const newMatches = { ...matches };
      delete newMatches[questionId];
      setMatches(newMatches);
    }
  };

  const handleTermPress = (termId: number) => {
    setSelectedTerm(termId);
  };

  const handleDefinitionPress = (definition: string) => {
    if (selectedTerm === null) {
      alert("Pumili muna ng salita sa kaliwa.");
      return;
    }
    setConnectedPairs((prev) => {
      const newState = { ...prev };
      const existingTermId = Object.keys(newState).find(
        (key) => newState[Number(key)] === definition
      );
      if (existingTermId) {
        delete newState[Number(existingTermId)];
      }
      newState[selectedTerm] = definition;
      return newState;
    });
    setSelectedTerm(null);
  };

  if (!chapter) {
    return (
      <div className="p-6">
        <p className="text-white">Chapter not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a342e] p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/student" className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="ml-2 flex-1 text-center text-lg font-bold text-[#e8d4b0]">
          {chapter.tag}
        </h1>
      </div>

      {/* Chapter Image */}
      <div className="relative h-56 rounded-2xl border-2 border-[#5d4037] bg-black overflow-hidden mb-6">
        <img
          src={`/kabanata_${chapter.id}.${[1,2,3].includes(chapter.id) ? 'jpg' : 'png'}`}
          alt={chapter.title}
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute bottom-0 w-full bg-black/50 p-4">
          <p className="text-xs uppercase tracking-widest text-[#e8d4b0]">{chapter.tag}</p>
          <p className="text-xl font-bold text-white">{chapter.title}</p>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex rounded-xl border border-[#6d4c41] bg-[#5d4037] p-1 mb-6">
        <button
          onClick={() => setActiveTab("talasalitaan")}
          className={`flex-1 flex items-center justify-center rounded-lg py-3 ${
            activeTab === "talasalitaan" ? "bg-[#8d6e63]" : "bg-transparent"
          }`}
        >
          <BookOpen size={14} className={activeTab === "talasalitaan" ? "text-white" : "text-[#bcaaa4]"} />
          <span className={`ml-2 text-sm font-bold ${activeTab === "talasalitaan" ? "text-white" : "text-[#bcaaa4]"}`}>
            Talasalitaan
          </span>
        </button>
        <button
          onClick={() => setActiveTab("nobela")}
          className={`flex-1 flex items-center justify-center rounded-lg py-3 ${
            activeTab === "nobela" ? "bg-[#8d6e63]" : "bg-transparent"
          }`}
        >
          <BookOpen size={14} className={activeTab === "nobela" ? "text-white" : "text-[#bcaaa4]"} />
          <span className={`ml-2 text-sm font-bold ${activeTab === "nobela" ? "text-white" : "text-[#bcaaa4]"}`}>
            Nobela
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] rounded-2xl bg-[#efede6] p-5">
        {activeTab === "talasalitaan" ? (
          <div>
            {/* Multiple Choice */}
            {chapter.quizType === "multiple-choice" && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3e2723] mb-2">TUMPAK SALITA</h2>
                <p className="text-sm text-[#5d4037] mb-6 opacity-80">
                  <span className="font-bold">Panuto: </span>
                  Basahin nang mabuti ang bawat pangungusap. Piliin at pindutin ang pinakaangkop na kasingkahulugan.
                </p>
                {chapter.quiz.map((item, index) => (
                  <div key={item.id} className="mb-8">
                    <p className="mb-3 text-sm leading-6 text-[#3e2723]">
                      {index + 1}. {item.question?.split(item.wordToDefine || "").map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && <span className="font-bold underline">{item.wordToDefine}</span>}
                        </span>
                      ))}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.options?.map((option, idx) => {
                        const isSelected = selectedAnswers[item.id] === option;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectAnswer(item.id, option)}
                            className={`py-2 px-1 rounded-lg border text-xs font-bold ${
                              isSelected
                                ? "bg-[#3e2723] text-white border-[#3e2723]"
                                : "bg-[#e8d4b0] text-[#3e2723] border-[#3e2723]"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mind Map */}
            {chapter.quizType === "mind-map" && (
              <div className="py-4">
                <h2 className="font-bold text-lg text-[#3e2723] mb-4 text-center">Buuin ang Diwa</h2>
                <p className="text-xs text-[#5d4037] mb-6 text-center opacity-70">
                  Isulat sa bawat hugis ang unang salitang pumasok sa iyong isipan na may kaugnayan sa salitang nasa gitna.
                </p>

                <div className="relative h-[300px] w-full flex items-center justify-center mb-6">
                  {/* Connection lines */}
                  <div className="absolute left-[35%] top-[60px] h-16 w-0.5 -rotate-45 bg-[#3e2723]/50" />
                  <div className="absolute right-[35%] top-[60px] h-16 w-0.5 rotate-45 bg-[#3e2723]/50" />
                  <div className="absolute bottom-[60px] left-[35%] h-16 w-0.5 rotate-45 bg-[#3e2723]/50" />
                  <div className="absolute bottom-[60px] right-[35%] h-16 w-0.5 -rotate-45 bg-[#3e2723]/50" />

                  {/* Center circle */}
                  <div className="z-10 h-32 w-32 rounded-full border-2 border-dashed border-[#3e2723] bg-[#f5c170] flex items-center justify-center shadow-sm">
                    <div className="h-28 w-28 rounded-full border border-[#3e2723] bg-[#f5c170] flex items-center justify-center">
                      <span className="font-serif font-bold text-lg text-[#3e2723]">
                        {chapter.quiz[0].centerWord}
                      </span>
                    </div>
                  </div>

                  {/* Input circles */}
                  {[
                    { top: 0, left: 0 },
                    { top: 0, right: 0 },
                    { bottom: 0, left: 0 },
                    { bottom: 0, right: 0 },
                  ].map((pos, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="?"
                      value={mindMapInputs[idx]}
                      onChange={(e) => handleMindMapChange(e.target.value, idx)}
                      className="absolute h-12 w-28 rounded-full border border-[#3e2723] bg-[#e8d4b0] text-center text-xs font-bold text-[#3e2723] shadow-sm"
                      style={pos}
                    />
                  ))}
                </div>

                <p className="text-xs text-[#3e2723] pt-4 border-t border-[#3e2723]/20 text-justify">
                  <span className="font-bold">Pahiwatig: </span>
                  {chapter.quiz[0].hint}
                </p>
              </div>
            )}

            {/* Punan Mo */}
            {chapter.quizType === "punan-mo" && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3e2723] mb-2 text-center">PUNAN MO!</h2>
                <p className="text-sm text-[#5d4037] mb-6 opacity-80">
                  <span className="font-bold">Panuto: </span>
                  Isulat ang nawawalang titik sa ilang kahon upang mabuo ang kahulugan ng salitang may salungguhit.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {chapter.quiz.map((item, index) => (
                    <div key={item.id} className={`${index === 4 ? "col-span-2" : ""}`}>
                      <div className="min-h-[80px] justify-center border border-[#3e2723]/30 bg-[#e8d4b0]/30 p-2 mb-2 shadow-sm">
                        <p className="text-xs leading-4 text-[#3e2723]">
                          {index + 1}. {item.question?.split(item.wordToDefine || "").map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && <span className="font-bold underline">{item.wordToDefine}</span>}
                            </span>
                          ))}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-1">
                        {item.clues?.map((char, charIdx) => {
                          const isPreFilled = char !== "";
                          const inputKey = `q${item.id}-${charIdx}`;
                          return (
                            <div
                              key={charIdx}
                              className="h-8 w-8 flex items-center justify-center border-b-2 border-[#3e2723]"
                            >
                              {isPreFilled ? (
                                <span className="font-bold text-xs text-[#3e2723]">{char}</span>
                              ) : (
                                <input
                                  type="text"
                                  maxLength={1}
                                  value={punanInputs[inputKey] || ""}
                                  onChange={(e) =>
                                    handlePunanTextChange(e.target.value, item.id, charIdx, item.clues || [])
                                  }
                                  className="w-full h-full text-center font-bold text-xs text-[#3e2723] bg-transparent"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching */}
            {chapter.quizType === "matching" && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3e2723] mb-2 text-center">
                  {chapter.quizTitle}
                </h2>
                <p className="text-sm text-[#5d4037] mb-6 opacity-80">
                  <span className="font-bold">Panuto: </span>
                  {chapter.quizInstructions || "Iugnay ang salita sa tamang kahulugan."}
                </p>

                <div className="space-y-4 mb-8">
                  {chapter.quiz.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <button
                        onClick={() => handleLineClick(item.id)}
                        className={`flex-1 border-b-2 min-h-[32px] flex items-end justify-center pb-1 ${
                          matches[item.id] ? "bg-[#3e2723]/10 border-[#3e2723]" : "border-[#3e2723]"
                        }`}
                      >
                        <span className="font-bold text-xs text-[#3e2723]">{matches[item.id] || ""}</span>
                      </button>
                      <div className="flex-1">
                        <p className="text-xs leading-4 text-[#3e2723]">
                          {item.id}. <span className="font-bold">{item.term}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-2 border-t border-[#3e2723]/20 pt-6">
                  {chapter.matchingChoices?.map((choice, idx) => {
                    const isUsed = Object.values(matches).includes(choice);
                    const isActive = activeChoice === choice;
                    if (isUsed) return null;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoiceClick(choice)}
                        className={`rounded-md border px-3 py-2 ${
                          isActive
                            ? "border-[#3e2723] bg-[#3e2723]"
                            : "border-[#8d6e63] bg-[#bcaaa4]"
                        } shadow-sm`}
                      >
                        <span className={`text-[10px] font-bold ${isActive ? "text-white" : "text-[#3e2723]"}`}>
                          {choice}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Line Connect */}
            {chapter.quizType === "line-connect" && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3e2723] mb-2 text-center">
                  {chapter.quizTitle}
                </h2>
                <p className="text-sm text-[#5d4037] mb-6 opacity-80">
                  <span className="font-bold">Panuto: </span>
                  {chapter.quizInstructions}
                </p>

                <div className="flex justify-between gap-4">
                  {/* Left Column */}
                  <div className="w-[40%] space-y-4">
                    {chapter.quiz.map((item) => {
                      const isMatched = !!connectedPairs[item.id];
                      const isSelected = selectedTerm === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleTermPress(item.id)}
                          className={`w-full h-24 flex items-center justify-center rounded-lg border-2 p-3 ${
                            isMatched
                              ? "border-[#3e2723] bg-[#d7ccc8]"
                              : isSelected
                                ? "border-[#3e2723] bg-[#f5c170]"
                                : "border-[#3e2723] bg-[#e8d4b0]"
                          }`}
                        >
                          <span className="text-xs font-bold text-[#3e2723] text-center">{item.term}</span>
                          {isMatched && (
                            <span className="absolute right-[-10px] top-10 rounded-full border border-[#e8d4b0] bg-[#3e2723] p-1">
                              <svg className="w-3 h-3 text-[#e8d4b0]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="w-[55%] space-y-4">
                    {chapter.matchingChoices?.map((choice, idx) => {
                      const isMatched = Object.values(connectedPairs).includes(choice);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleDefinitionPress(choice)}
                          className={`w-full h-24 flex items-center justify-center rounded-lg border p-2 ${
                            isMatched ? "border-[#3e2723] bg-[#d7ccc8]" : "border-[#3e2723]/50 bg-white"
                          }`}
                        >
                          <p className="text-[10px] text-justify text-[#3e2723] leading-3">{choice}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full mt-8 rounded-lg bg-[#8d6e63] py-3 text-white font-bold"
            >
              <Save size={18} className="inline mr-2" />
              I-save ang Sagot
            </button>
          </div>
        ) : (
          // NOBELA VIEW
          <div>
            <h2 className="text-lg font-bold text-[#3e2723] mb-4 pb-2 border-b border-[#3e2723]/20">
              {chapter.tag}: {chapter.title}
            </h2>
            <p className="text-justify text-sm leading-7 text-[#3e2723] whitespace-pre-line">
              {chapter.nobela}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}