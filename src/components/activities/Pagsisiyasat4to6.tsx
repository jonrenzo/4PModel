"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function Pagsisiyasat4to6({ rangeId }: { rangeId: string }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#78350f] p-1.5"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 002-2V6a2 2 0 10-4 0v4a2 2 0 002 2zm0-3a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z" /></svg></div>
        <h2 className="font-serif text-lg font-bold text-[#3e2723]">Pagsisiyasat</h2>
      </div>
      <p className="p-4 bg-blue-50 rounded-xl text-sm text-center text-[#5d4037]">📁 Ipinapagawa ang Case Files (Suspects, Evidence, Culprit) - Coming soon!</p>
    </div>
  );
}