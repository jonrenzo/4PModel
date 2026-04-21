"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { chaptersData } from "@/lib/chaptersData";

// ── Question lookup maps ────────────────────────────────────────────────────
const QUESTIONS: Record<
  string,
  Record<string, { label: string; question: string }>
> = {
  "paghihinuha|01-03": {
    "1": {
      label: "Crisostomo Ibarra",
      question:
        "Batay sa kanyang kasuotan at ekspresyon, paano mo ilalarawan ang kanyang papel sa lipunang ginagalawan niya?",
    },
    "2": {
      label: "Maria Clara",
      question:
        "Ano ang ipinapakita ng kanyang postura kung siya ba ay mahinhin, mahiyain, o matapang? Ipaliwanag.",
    },
    "3": {
      label: "Padre Damaso",
      question:
        "Tingnan ang ekspresyon ng pari. Sa iyong palagay, siya ba ay isang prayleng mapagpakumbaba o isang taong madaling magalit? Bakit?",
    },
    "4": {
      label: "Donya Pia Alba",
      question:
        "Batay sa kanyang postura, paano mo ilalarawan ang katangian na namamayani sa kanya?",
    },
    "5": {
      label: "Kapitan Tiyago",
      question:
        "Ano ang maaaring ipahiwatig ng kanyang ekspresyon sa mata o mukha tungkol sa kanyang pag-iisip o damdamin?",
    },
    "6": {
      label: "Tiya Isabel",
      question:
        "Batay sa kaniyang pananamit, anong hinuha ang mabubuo mo tungkol sa kaniyang katayuan sa lipunan?",
    },
  },
  "paghihinuha|04-06": {
    "1-tauhan": {
      label: "Tomb — Tauhan",
      question: "Anong tauhan ang kinakatawan ng tomb?",
    },
    "1-pahiwatig": {
      label: "Tomb — Pahiwatig",
      question: "Ano ang pahiwatig ng tomb?",
    },
    "2-tauhan": {
      label: "Fan & Cross — Tauhan",
      question: "Anong tauhan ang kinakatawan ng fan at cross?",
    },
    "2-pahiwatig": {
      label: "Fan & Cross — Pahiwatig",
      question: "Ano ang pahiwatig ng fan at cross?",
    },
    "3-tauhan": {
      label: "Cane & Chest — Tauhan",
      question: "Anong tauhan ang kinakatawan ng cane at chest?",
    },
    "3-pahiwatig": {
      label: "Cane & Chest — Pahiwatig",
      question: "Ano ang pahiwatig ng cane at chest?",
    },
  },
  "paglilinaw|01-03": {
    "1": {
      label: "Tanong 1",
      question: "Sang-ayon ka ba na si Kapitan Tiago ay isang oportunista?",
    },
    "2": {
      label: "Tanong 2",
      question:
        "Ang kawalan ba ng reaksyon ni Ibarra ay tanda ng kanyang pagiging edukado?",
    },
    "3": {
      label: "Tanong 3",
      question:
        "Sang-ayon ka ba kay Padre Sibyla na palihim niyang pinupuna si Ibarra?",
    },
    "4": {
      label: "Tanong 4",
      question:
        "Paano ang matibay na prinsipyo ni Don Rafael ang naging mitsa ng kanyang tunggalian?",
    },
  },
  "paglilinaw|04-06": {
    "1": {
      label: "Tanong 1",
      question:
        "Ano ang ibig sabihin ni Tenyente Guevarra nang sabihin niyang 'mag-ingat' si Ibarra? Ipaliwanag ang kontekstong historikal at personal na dahilan kung bakit mahalaga ang babalang ito.",
    },
    "2": {
      label: "Tanong 2",
      question:
        "Paano naging simbolo ng kawalang-katarungan ang sinapit ni Don Rafael? Ipaliwanag batay sa pangyayari sa artilyero at sa mga paratang laban sa kanya.",
    },
    "3": {
      label: "Tanong 3",
      question:
        "Sa Kabanata V, bakit inihambing ang liwanag mula sa bahay ni Maria Clara sa isang 'tala sa gabing madilim'? Ano ang ipinapakitang emosyon at simbolo nito?",
    },
    "4": {
      label: "Tanong 4",
      question:
        "Ano ang ipinapakitang katangian ni Padre Sibyla at ng batang Pransiskano sa eksena sa bahay ni Kapitan Tiyago?",
    },
    "5": {
      label: "Tanong 5",
      question:
        "Bakit sinasabing may 'kapangyarihan' ang pag-ibig sa pamilya at kabanata sa karakter nina Ibarra at Maria Clara sa Kabanata V-VI?",
    },
    "6": {
      label: "Tanong 6",
      question:
        "Ano ang ipinahihiwatig ng pagiging 'tunay na Espanyol' ni Kapitan Tiyago ayon sa kanyang asal at paniniwala?",
    },
  },
  "pagsisiyasat|01-03": {
    "1": {
      label: "Tanong 1",
      question:
        "Batay sa mga naging pahayag at kilos ng mga panauhin. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan?",
    },
    "2": {
      label: "Tanong 2",
      question:
        "Paano inilarawan sa teksto ang pagtrato kay Ibarra? Ano ang ipinahihiwatig nito?",
    },
    "3": {
      label: "Tanong 3",
      question:
        "Ano-ano ang mga ginawa ng mga prayle sa nobela? Makatarungan ba?",
    },
    "4": {
      label: "Tanong 4",
      question:
        "Paano nahahayag ang tunay na pagkatao ni Ibarra sa Kabanata 2?",
    },
    "5": {
      label: "Tanong 5",
      question:
        "Paano masasabing ang handaan ay isang salamin ng lipunang Pilipino?",
    },
  },
  "pagsisiyasat|04-06": {
    case1_suspect1: {
      label: "Case 1 — Suspek 1",
      question: "Sino ang posibleng suspek? (Pangalan ng unang tauhan)",
    },
    case1_suspect2: {
      label: "Case 1 — Suspek 2",
      question: "Sino ang posibleng suspek? (Pangalan ng ikalawang tauhan)",
    },
    case1_suspect3: {
      label: "Case 1 — Suspek 3",
      question: "Sino ang posibleng suspek? (Pangalan ng ikatlong tauhan)",
    },
    case2_motibo1: {
      label: "Case 2 — Motibo 1",
      question: "Ano ang motibo ng Suspek 1 sa pagpapakulong kay Don Rafael?",
    },
    case2_paliwanag1: {
      label: "Case 2 — Paliwanag 1",
      question: "Ipaliwanag ang motibo ng Suspek 1.",
    },
    case2_motibo2: {
      label: "Case 2 — Motibo 2",
      question: "Ano ang motibo ng Suspek 2 sa pagpapakulong kay Don Rafael?",
    },
    case2_paliwanag2: {
      label: "Case 2 — Paliwanag 2",
      question: "Ipaliwanag ang motibo ng Suspek 2.",
    },
    case2_motibo3: {
      label: "Case 2 — Motibo 3",
      question: "Ano ang motibo ng Suspek 3 sa pagpapakulong kay Don Rafael?",
    },
    case2_paliwanag3: {
      label: "Case 2 — Paliwanag 3",
      question: "Ipaliwanag ang motibo ng Suspek 3.",
    },
    case3_answer: {
      label: "Case 3 — Konklusyon",
      question:
        "Batay sa iyong pagsusuri sa nobela, sino ang tunay na salarin sa pagkakakulong ng ama ni Crisostomo Ibarra, at paano niya naisakatuparan ang kaniyang masamang layunin?",
    },
  },
  "pagbubuod|01-03": {
    "1": {
      label: "Buod",
      question:
        "Sumulat ng maikling buod (hanggang 10 pangungusap) mula sa Kabanata 1-3.",
    },
  },
  "pagbubuod|04-06": {
    "1": {
      label: "Buod",
      question: "Sumulat ng buod (4-6 pangungusap) mula sa Kabanata 4-6.",
    },
  },
};

// ── Types ───────────────────────────────────────────────────────────────────
type ActivityAnswer = {
  activity_type: string;
  chapter_range: string;
  question_index: string;
  answer: string;
};
type TalasalitaanAnswer = {
  chapter_id: number;
  quiz_type: string;
  answers: Record<string, string>;
  score: number;
};
type FeedbackRow = {
  activity_type: string;
  chapter_range: string;
  question_index: string;
  feedback: string;
};

interface Props {
  student: { id: string; name: string };
  teacherId: string;
  onClose: () => void;
}

const TABS = [
  { id: "talasalitaan", label: "Talasalitaan" },
  { id: "paghihinuha", label: "Paghihinuha" },
  { id: "paglilinaw", label: "Paglilinaw" },
  { id: "pagsisiyasat", label: "Pagsisiyasat" },
  { id: "pagbubuod", label: "Pagbubuod" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Feedback key helper ─────────────────────────────────────────────────────
function fkey(actType: string, chapterRange: string, qIndex: string) {
  return `${actType}|${chapterRange}|${qIndex}`;
}

// ── Answer Card ─────────────────────────────────────────────────────────────
function AnswerCard({
  label,
  question,
  answer,
  feedbackValue,
  onFeedbackChange,
  saving,
  saved,
}: {
  label: string;
  question: string;
  answer: string;
  feedbackValue: string;
  onFeedbackChange: (v: string) => void;
  saving: boolean;
  saved: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#c4b09a] bg-white overflow-hidden shadow-sm">
      {/* Question */}
      <div className="bg-[#3e2723] px-3 py-2">
        <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wide">
          {label}
        </span>
        <p className="text-xs text-[#e8d4b0] mt-0.5 leading-relaxed">
          {question}
        </p>
      </div>
      {/* Student answer */}
      <div className="px-3 py-2 border-b border-[#e8ddd4]">
        <p className="text-[10px] font-semibold text-[#8d6e63] mb-1">
          Sagot ng Estudyante:
        </p>
        {answer ? (
          <p className="text-xs text-[#3e2723] leading-relaxed whitespace-pre-wrap">
            {answer}
          </p>
        ) : (
          <p className="text-xs text-[#aaa] italic">Hindi pa nasasagutan.</p>
        )}
      </div>
      {/* Teacher feedback */}
      <div className="px-3 py-2 bg-[#fdf8f3]">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold text-[#5d4037] flex items-center gap-1">
            <MessageSquare size={10} /> Feedback ng Guro:
          </p>
          <span
            className={`text-[10px] transition-opacity ${saving ? "opacity-100 text-[#8d6e63]" : saved ? "opacity-100 text-[#2e7d32] font-semibold" : "opacity-0"}`}
          >
            {saving ? "Sine-save..." : "✓ Nai-save!"}
          </span>
        </div>
        <textarea
          className="w-full text-xs border border-[#d4c4b4] rounded-lg p-2 bg-white text-[#3e2723] focus:outline-none focus:border-[#8d6e63] resize-none min-h-[60px]"
          placeholder="Mag-iwan ng feedback..."
          value={feedbackValue}
          onChange={(e) => onFeedbackChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// ── Collapsible Section ─────────────────────────────────────────────────────
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#5d4037] rounded-xl text-[#e8d4b0] text-xs font-bold mb-2 hover:bg-[#6d4c41] transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function StudentAnswerPanel({
  student,
  teacherId,
  onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("talasalitaan");
  const [activities, setActivities] = useState<ActivityAnswer[]>([]);
  const [talasalitaan, setTalasalitaan] = useState<TalasalitaanAnswer[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Load data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/teacher/student-answers?studentId=${student.id}&teacherId=${teacherId}`,
        );
        const data = await res.json();
        setActivities(data.activities || []);
        setTalasalitaan(data.talasalitaan || []);
        const map: Record<string, string> = {};
        for (const fb of data.feedback || []) {
          map[fkey(fb.activity_type, fb.chapter_range, fb.question_index)] =
            fb.feedback;
        }
        setFeedbackMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [student.id, teacherId]);

  // Handle feedback change with debounce
  const handleFeedbackChange = (
    actType: string,
    chRange: string,
    qIndex: string,
    value: string,
  ) => {
    const key = fkey(actType, chRange, qIndex);
    setFeedbackMap((prev) => ({ ...prev, [key]: value }));
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      setSavingKeys((prev) => new Set(prev).add(key));
      await fetch("/api/teacher/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          student_id: student.id,
          activity_type: actType,
          chapter_range: chRange,
          question_index: qIndex,
          feedback: value,
        }),
      });
      setSavingKeys((prev) => {
        const s = new Set(prev);
        s.delete(key);
        return s;
      });
      setSavedKeys((prev) => new Set(prev).add(key));
      setTimeout(
        () =>
          setSavedKeys((prev) => {
            const s = new Set(prev);
            s.delete(key);
            return s;
          }),
        2000,
      );
    }, 1200);
  };

  // Helper: get answers for a specific activity + range
  const getAnswers = (actType: string, range: string) =>
    activities.filter(
      (a) => a.activity_type === actType && a.chapter_range === range,
    );

  // Render answer cards for a given activity+range
  const renderCards = (actType: string, range: string) => {
    const qMap = QUESTIONS[`${actType}|${range}`] ?? {};
    const answers = getAnswers(actType, range);
    const answerMap = Object.fromEntries(
      answers.map((a) => [String(a.question_index), a.answer]),
    );
    const keys = Object.keys(qMap);
    if (keys.length === 0)
      return <p className="text-xs text-[#aaa] italic px-1">Walang datos.</p>;
    return keys.map((qId) => {
      const { label, question } = qMap[qId];
      const key = fkey(actType, range, qId);
      return (
        <AnswerCard
          key={key}
          label={label}
          question={question}
          answer={answerMap[qId] ?? ""}
          feedbackValue={feedbackMap[key] ?? ""}
          onFeedbackChange={(v) => handleFeedbackChange(actType, range, qId, v)}
          saving={savingKeys.has(key)}
          saved={savedKeys.has(key)}
        />
      );
    });
  };

  // Render Talasalitaan tab
  const renderTalasalitaan = () => {
    if (talasalitaan.length === 0)
      return (
        <p className="text-xs text-[#aaa] italic px-1">
          Walang talasalitaan na nasagot pa.
        </p>
      );
    return talasalitaan
      .sort((a, b) => a.chapter_id - b.chapter_id)
      .map((row) => {
        const chRange = String(row.chapter_id);
        const key = fkey("talasalitaan", chRange, "all");
        const chapterInfo = chaptersData.find((c) => c.id === row.chapter_id);

        return (
          <div
            key={row.chapter_id}
            className="rounded-xl border border-[#c4b09a] bg-white overflow-hidden shadow-sm mb-3"
          >
            <div className="bg-[#3e2723] px-3 py-2 flex justify-between items-center">
              <span className="text-xs font-bold text-[#d4af37]">
                Kabanata {row.chapter_id}: {chapterInfo?.title}
              </span>
              <span className="text-[10px] text-[#e8d4b0]">
                Iskor: {row.score}
              </span>
            </div>
            <div className="px-3 py-2 border-b border-[#e8ddd4]">
              <p className="text-[10px] font-semibold text-[#8d6e63] mb-2">
                Mga Sagot:
              </p>
              <div className="space-y-3">
                {Array.isArray(row.answers) ? (
                  // Handle array answers (like mind-map)
                  <div className="text-xs border-l-2 border-[#d4c4b4] pl-2 py-1">
                    <p className="text-[#5d4037] font-bold mb-1">
                      Kaugnay na mga salita para sa:{" "}
                      <span className="underline">
                        {chapterInfo?.quiz[0]?.centerWord || chapterInfo?.title}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {row.answers.map((ans, idx) => (
                        <span
                          key={idx}
                          className="bg-[#efede6] px-2 py-0.5 rounded text-[#3e2723] border border-[#d4c4b4]"
                        >
                          {ans || "—"}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Handle object answers (multiple-choice, matching, etc.)
                  Object.entries(row.answers).map(([qId, ans]) => {
                    const quizItem = chapterInfo?.quiz.find(
                      (item) => item.id === Number(qId),
                    );
                    let questionText =
                      quizItem?.question ||
                      quizItem?.term ||
                      quizItem?.centerWord ||
                      "Tanong " + qId;

                    if (
                      quizItem?.wordToDefine &&
                      questionText.includes(quizItem.wordToDefine)
                    ) {
                      questionText = questionText.replace(
                        quizItem.wordToDefine,
                        `[${quizItem.wordToDefine}]`,
                      );
                    }

                    return (
                      <div
                        key={qId}
                        className="text-xs border-l-2 border-[#d4c4b4] pl-2 py-1"
                      >
                        <p className="text-[#5d4037] font-bold mb-1">
                          {questionText}
                        </p>
                        <div className="flex gap-2 items-center">
                          <span className="bg-[#efede6] px-2 py-0.5 rounded text-[#3e2723] border border-[#d4c4b4]">
                            {ans || "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="px-3 py-2 bg-[#fdf8f3]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold text-[#5d4037] flex items-center gap-1">
                  <MessageSquare size={10} /> Feedback ng Guro:
                </p>
                <span
                  className={`text-[10px] transition-opacity ${savingKeys.has(key) ? "opacity-100 text-[#8d6e63]" : savedKeys.has(key) ? "opacity-100 text-[#2e7d32] font-semibold" : "opacity-0"}`}
                >
                  {savingKeys.has(key) ? "Sine-save..." : "✓ Nai-save!"}
                </span>
              </div>
              <textarea
                className="w-full text-xs border border-[#d4c4b4] rounded-lg p-2 bg-white text-[#3e2723] focus:outline-none focus:border-[#8d6e63] resize-none min-h-[60px]"
                placeholder="Mag-iwan ng feedback..."
                value={feedbackMap[key] ?? ""}
                onChange={(e) =>
                  handleFeedbackChange(
                    "talasalitaan",
                    chRange,
                    "all",
                    e.target.value,
                  )
                }
              />
            </div>
          </div>
        );
      });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-[#f5ede0] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-[#3e2723] px-4 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#a1887f] uppercase tracking-widest">
              Mga Sagot ng Estudyante
            </p>
            <h2 className="text-base font-bold text-white truncate">
              {student.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#5d4037] text-[#e8d4b0] transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto bg-[#5d4037] flex-shrink-0 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-[#d4af37] text-[#d4af37] bg-[#4e3629]"
                  : "border-transparent text-[#d7ccc8] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center pt-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3e2723]" />
            </div>
          ) : activeTab === "talasalitaan" ? (
            renderTalasalitaan()
          ) : (
            <>
              <Section title="Kabanata 1–3">
                {renderCards(activeTab, "01-03")}
              </Section>
              <Section title="Kabanata 4–6" defaultOpen={false}>
                {renderCards(activeTab, "04-06")}
              </Section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
