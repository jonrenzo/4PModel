"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { BookOpen, Check } from "lucide-react";
import Link from "next/link";
import { chaptersData } from "@/lib/chaptersData";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
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

  const readChapters = progress
    .filter((p) => p.is_read)
    .map((p) => p.chapter_id);

  const studentName = profile?.name || "Mag-aaral";

  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      {/* Header Section */}
      <div className="bg-[#4a342e] px-6 pt-4 pb-6 rounded-t-lg">
        <div className="text-center mb-4">
          <p className="text-[#e8d4b0]">
            Kumusta, <span className="font-bold">{studentName}</span>
          </p>
        </div>
        <div className="rounded-lg border border-[#6d4c41] bg-[#5d4037] px-6 py-3 shadow-lg">
          <h1 className="text-center text-2xl font-bold tracking-wide text-[#f5f5f5]">
            Mga Piling Kabanata
          </h1>
        </div>
      </div>

      {/* White Scrollable Container */}
      <div className="min-h-[calc(100vh-180px)] overflow-hidden rounded-b-lg bg-[#efede6] shadow-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chaptersData.map((chapter) => {
            const isRead = readChapters.includes(chapter.id);
            return (
              <div key={chapter.id} className="bg-transparent">
                {/* Chapter Image Card */}
                <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-300 shadow-sm">
                  <img
                    src={`/kabanata_${chapter.id}.${[1,2,3].includes(chapter.id) ? 'jpg' : 'png'}`}
                    alt={chapter.title}
                    className="h-full w-full object-fill"
                  />
                  {isRead && (
                    <div className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#4f2b21]">
                      <Check size={20} className="text-[#97EF4B]" />
                    </div>
                  )}
                </div>

                {/* Chapter Tag */}
                <div className="mb-1 inline-block rounded-sm bg-[#4e342e] px-3 py-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e8d4b0]">
                    {chapter.tag}
                  </span>
                </div>

                {/* Chapter Title */}
                <h2 className="mb-3 text-xl font-bold leading-tight text-black">
                  {chapter.title}
                </h2>

                {/* Action Button */}
                <Link
                  href={`/student/chapter/${chapter.id}`}
                  className={`flex items-center justify-center rounded-full py-3 shadow-md ${
                    isRead ? "bg-[#5d4037]" : "bg-[#4f2b21]"
                  }`}
                >
                  <BookOpen
                    size={18}
                    className={isRead ? "fill-yellow-300/15" : ""}
                  />
                  <span className="ml-2 text-sm font-bold text-white">
                    {isRead
                      ? "Basahin Muli at Sagutin"
                      : "Basahin at Sagutin ang Nobela"}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
