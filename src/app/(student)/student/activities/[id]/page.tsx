"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Search, FileText, Eye, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase";

import Paghihinuha1to3 from "@/components/activities/Paghihinuha1to3";
import Paghihinuha4to6 from "@/components/activities/Paghihinuha4to6";
import Pagsisiyasat1to3 from "@/components/activities/Pagsisiyasat1to3";
import Pagsisiyasat4to6 from "@/components/activities/Pagsisiyasat4to6";
import Paglilinaw1to3 from "@/components/activities/Paglilinaw1to3";
import Paglilinaw4to6 from "@/components/activities/Paglilinaw4to6";
import Pagbubuod1to3 from "@/components/activities/Pagbubuod1to3";
import Pagbubuod4to6 from "@/components/activities/Pagbubuod4to6";

const activityInfo: Record<number, { title: string; subtitle: string; chapters: number[]; rangeId: string }> = {
  1: { title: "Kabanata 1-3", subtitle: "Isang Pagtitipon - Ang Hapunan", chapters: [1, 2, 3], rangeId: "01-03" },
  2: { title: "Kabanata 4-6", subtitle: "Erehe at Pilibustero - Si Kapitan Tiyago", chapters: [4, 5, 6], rangeId: "04-06" },
};

const tabs = [
  { id: "paghihinuha", label: "Paghihinuha", icon: Search, alwaysUnlocked: true },
  { id: "paglilinaw", label: "Paglilinaw", icon: Eye, alwaysUnlocked: false },
  { id: "pagsisiyasat", label: "Pagsisiyasat", icon: FileText, alwaysUnlocked: false },
  { id: "pagbubuod", label: "Pagbubuod", icon: Edit, alwaysUnlocked: false },
];

export default function ActivityContainerPage() {
  const params = useParams();
  const supabase = createClient();
  const id = Number(params.id);
  const activity = activityInfo[id];
  
  const [activeTab, setActiveTab] = useState("paghihinuha");
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkChapterProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLocked(true);
          setLoading(false);
          return;
        }

        const { data: progress } = await supabase
          .from("chapter_progress")
          .select("chapter_id, is_read")
          .eq("user_id", user.id)
          .eq("is_read", true);

        const readChapters = progress?.map(p => p.chapter_id) || [];
        const allRead = activity.chapters.every(ch => readChapters.includes(ch));
        
        setIsLocked(!allRead);
      } catch (error) {
        console.error("Error checking progress:", error);
        setIsLocked(true);
      } finally {
        setLoading(false);
      }
    };

    if (activity) {
      checkChapterProgress();
    }
  }, [activity, supabase]);

  if (!activity) {
    return (
      <div className="p-6">
        <p className="text-white">Activity not found</p>
      </div>
    );
  }

  const handleTabPress = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab?.alwaysUnlocked && isLocked) {
      alert("Naka-lock ang Gawain: Kailangan munang basahin ang lahat ng kabanata sa saklaw na ito bago buksan ang gawaing ito.");
      return;
    }
    setActiveTab(tabId);
  };

  const renderContent = () => {
    if (id === 1) {
      switch (activeTab) {
        case "paghihinuha": return <Paghihinuha1to3 rangeId={activity.rangeId} />;
        case "paglilinaw": return <Paglilinaw1to3 rangeId={activity.rangeId} />;
        case "pagsisiyasat": return <Pagsisiyasat1to3 rangeId={activity.rangeId} />;
        case "pagbubuod": return <Pagbubuod1to3 rangeId={activity.rangeId} />;
      }
    } else {
      switch (activeTab) {
        case "paghihinuha": return <Paghihinuha4to6 rangeId={activity.rangeId} />;
        case "paglilinaw": return <Paglilinaw4to6 rangeId={activity.rangeId} />;
        case "pagsisiyasat": return <Pagsisiyasat4to6 rangeId={activity.rangeId} />;
        case "pagbubuod": return <Pagbubuod4to6 rangeId={activity.rangeId} />;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f5c170]"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center">
          <Link href="/student/activities" className="p-2 text-[#e8d4b0] hover:bg-[#5d4037] rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="ml-2 text-lg font-bold text-[#e8d4b0]">{activity.title}</h1>
        </div>
      </div>

      {/* 4P Navigation Tabs */}
      <div className="flex rounded-xl border border-[#8d6e63] bg-[#6d4c41] p-1 mb-4 flex-shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isTabLocked = !tab.alwaysUnlocked && isLocked;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 px-3 transition-all ${
                isActive ? "bg-[#efede6] shadow-md" : ""
              } ${isTabLocked ? "opacity-50" : ""}`}
            >
              <tab.icon size={16} color={isActive ? "#3e2723" : "#e8d4b0"} />
              <span className={`text-xs font-bold ${isActive ? "text-[#3e2723]" : "text-[#e8d4b0]"}`}>
                {tab.label}
              </span>
              {isTabLocked && <Lock size={12} color="#e8d4b0" />}
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-[#8d6e63] bg-[#d7ccc8]">
        <div className="h-full overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}