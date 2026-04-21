"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

type StudentRow = {
  id: string;
  name: string;
  chaptersRead: number;
  talasalitaanDone: number;
  paghihinuha: number;
  pagsisiyasat: number;
  paglilinaw: number;
  pagbubuod: number;
};

interface ClassMetricsProps {
  students: StudentRow[];
}

const COLORS = ["#2e7d32", "#d4af37", "#8d6e63"]; // Green, Gold, Brown

export default function ClassMetrics({ students }: ClassMetricsProps) {
  if (students.length === 0) return null;

  // 1. Progress Distribution (Pie)
  const complete = students.filter((s) => s.chaptersRead === 6).length;
  const inProgress = students.filter((s) => s.chaptersRead > 0 && s.chaptersRead < 6).length;
  const notStarted = students.filter((s) => s.chaptersRead === 0).length;

  const pieData = [
    { name: "Kumpleto (6/6)", value: complete },
    { name: "Nagpapatuloy", value: inProgress },
    { name: "Hindi pa Nagsisimula", value: notStarted },
  ].filter(d => d.value > 0);

  // 2. Activity Breakdown (Radar)
  const avg = (key: keyof StudentRow, max: number) => {
    const total = students.reduce((acc, s) => acc + (s[key] as number), 0);
    return Math.round(((total / (students.length * max)) * 100));
  };

  const radarData = [
    { subject: "Paghihinuha", A: avg("paghihinuha", 12), fullMark: 100 },
    { subject: "Pagsisiyasat", A: avg("pagsisiyasat", 15), fullMark: 100 },
    { subject: "Paglilinaw", A: avg("paglilinaw", 10), fullMark: 100 },
    { subject: "Pagbubuod", A: avg("pagbubuod", 2), fullMark: 100 },
    { subject: "Talasalitaan", A: avg("talasalitaanDone", 6), fullMark: 100 },
  ];

  // 3. Chapter Status (Bar) - We'd need actual per-student per-chapter data for a real bar chart,
  // but we can estimate based on chaptersRead if we assume they are read in order, 
  // or just use the radar as the main performance metric.
  // Instead, let's show a "Summary Stats" card.

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Overall Progress Pie */}
      <div className="bg-[#efede6] p-6 rounded-2xl border border-[#c4b09a] shadow-sm">
        <h3 className="text-[#3e2723] font-bold mb-4 text-center">Distribusyon ng Pag-unlad</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#efede6", border: "1px solid #c4b09a", borderRadius: "8px" }}
                itemStyle={{ color: "#3e2723" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Radar */}
      <div className="bg-[#efede6] p-6 rounded-2xl border border-[#c4b09a] shadow-sm">
        <h3 className="text-[#3e2723] font-bold mb-4 text-center">Pagganap sa mga Gawain (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#c4b09a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#5d4037", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8d6e63" }} />
              <Radar
                name="Class Avg"
                dataKey="A"
                stroke="#d4af37"
                fill="#d4af37"
                fillOpacity={0.6}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#efede6", border: "1px solid #c4b09a", borderRadius: "8px" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
