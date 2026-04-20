"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { chaptersData } from "@/lib/chaptersData";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [talasalitaanAnswers, setTalasalitaanAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const supabase = createClient();

  const totalQuestions = 36 + 26;

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        const { data: progressData } = await supabase
          .from("chapter_progress")
          .select("chapter_id, is_read")
          .eq("user_id", user.id);

        setProgress(progressData || []);

        const { data: answersData } = await supabase
          .from("talasalitaan_answers")
          .select("*")
          .eq("user_id", user.id);

        setTalasalitaanAnswers(answersData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4f2b21]">
        <p className="text-[#E8D4B0]">Loading...</p>
      </div>
    );
  }

  const readChapters = progress.filter((p) => p.is_read).map((p) => p.chapter_id);
  const readProgress = { read: readChapters.length, total: chaptersData.length };
  const totalAnswered = talasalitaanAnswers.length;
  const progressPercentage = totalAnswered > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
  
  const studentName = profile?.name || "User";

  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      <div className="bg-[#efede6] rounded-t-lg p-6 pb-28">
        <div className="mb-8 mt-4 flex flex-col items-center">
          <div className="mb-4 h-24 w-24 rounded-full border-4 border-[#8B4513] bg-[#4a342e] flex items-center justify-center">
            <span className="font-serif text-4xl text-[#e8d4b0]">
              {studentName?.charAt(0) || "U"}
            </span>
          </div>
          <h2 className="font-bold text-2xl text-[#4a342e]">{studentName}</h2>
          <p className="text-[#4a342e] opacity-70">
            {profile?.role === "teacher" ? "Guro" : "Mag-aaral"} - {profile?.grade || "-"} -{" "}
            {profile?.section || "-"}
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-2 font-bold text-[#4a342e]">Nabasa na Kabanata</p>
          <div className="h-4 w-full rounded-full bg-gray-200">
            <div
              style={{
                width: `${readProgress.total > 0 ? (readProgress.read / readProgress.total) * 100 : 0}%`,
              }}
              className="h-4 rounded-full bg-[#3e2723]"
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-500">
            {readProgress.read} out of {readProgress.total} na kabanata ang nabasa
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-2 font-bold text-[#4a342e]">Aking Progreso</p>
          <div className="h-4 w-full rounded-full bg-gray-200">
            <div
              style={{ width: `${progressPercentage}%` }}
              className="h-4 rounded-full bg-[#3e2723]"
            />
          </div>
          <p className="mt-1 text-right text-xs text-gray-500">
            {talasalitaanAnswers.length} out of {totalQuestions} na nasagutan
          </p>
        </div>

        <button
          onClick={() => setShowQR(true)}
          className="mt-4 w-full rounded-full bg-[#8d6e63] py-3 shadow-lg text-white font-bold uppercase tracking-wider hover:bg-[#7a5d53]"
        >
          Ipakita ang QR
        </button>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="font-bold text-lg mb-4 text-center">Lahat ng mga Sagot</h3>
            <div className="bg-white p-4 rounded-lg max-h-80 overflow-y-auto">
              <p className="text-xs whitespace-pre-wrap">
                {`User: ${studentName}
Grade: ${profile?.grade || "-"}
Section: ${profile?.section || "-"}

--- Talasalitaan Answers ---

${talasalitaanAnswers.map((ans) => `Kabanata ${ans.chapter_id} (${ans.quiz_type})`).join("\n")}`}
              </p>
            </div>
            <div className="mt-4 flex justify-around">
              <button
                onClick={() => {
                  const text = `User: ${studentName}\nGrade: ${profile?.grade || "-"}\nSection: ${profile?.section || "-"}`;
                  navigator.clipboard.writeText(text);
                  alert("Kinopya!");
                }}
                className="rounded-full bg-blue-500 px-6 py-2 text-white font-bold"
              >
                Kopyahin
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="rounded-full bg-[#3e2723] px-6 py-2 text-white font-bold"
              >
                Isara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}