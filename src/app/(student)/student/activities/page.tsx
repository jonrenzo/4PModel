"use client";

import Link from "next/link";
import { BookOpen, Brain, ArrowRight } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Kabanata 1-3",
    rangeId: "01-03",
    subtitle: "Isang Pagtitipon - Ang Hapunan",
    icon: BookOpen,
    color: "bg-[#8d6e63]",
    chapters: [1, 2, 3],
  },
  {
    id: 2,
    title: "Kabanata 4-6",
    rangeId: "04-06",
    subtitle: "Erehe at Pilibustero - Si Kapitan Tiyago",
    icon: Brain,
    color: "bg-[#f5c170]",
    chapters: [4, 5, 6],
  },
];

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      {/* Header Section */}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-widest text-[#e8d4b0] opacity-80">
          Noli Me Tangere
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Mga Gawain</h1>
        <p className="text-sm leading-5 text-[#bcaaa4]">
          Piliin ang pangkat ng kabanata upang simulan ang iyong pagsusulit at aktibidad.
        </p>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={`/student/activities/${activity.id}`}
            className="block w-full overflow-hidden rounded-3xl border-b-8 border-r-4 border-[#3e2723] bg-[#efede6] shadow-lg"
          >
            {/* Card Header Decoration */}
            <div className={`h-2 w-full ${activity.color}`} />

            <div className="p-6">
              <div className="flex items-start justify-between">
                {/* Left Side: Icon & Title */}
                <div>
                  <div className="flex items-center mb-2">
                    <div className="mr-3 h-10 w-10 rounded-full bg-[#5d4037]/10 flex items-center justify-center">
                      <activity.icon size={22} color="#5d4037" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[#8d6e63] font-medium">
                      Saklaw na Kabanata
                    </span>
                  </div>

                  {/* Big Number Typography */}
                  <p className="font-serif text-5xl text-[#3e2723] mb-1">{activity.rangeId}</p>
                  <p className="font-bold text-lg text-[#5d4037]">{activity.subtitle}</p>
                </div>

                {/* Right Side: Arrow Circle */}
                <div className="h-12 w-12 rounded-full bg-[#3e2723] flex items-center justify-center shadow-sm">
                  <ArrowRight size={24} color="#e8d4b0" />
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-[1px] w-full bg-[#3e2723]/10" />

              {/* Footer: Tags */}
              <div className="flex flex-wrap gap-2">
                {["Paghihinuha", "Paglilinaw", "Pagsisiyasat", "Pagbubuod"].map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-[#5d4037]/10 bg-[#5d4037]/5 px-2 py-1 text-[10px] text-[#5d4037]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}