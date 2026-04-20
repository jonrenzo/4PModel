"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function Paglilinaw4to6({ rangeId }: { rangeId: string }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3e2723]"></div></div>;

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="rounded-full bg-[#3e2723] p-1.5"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v2a1 1 0 11-2 0v-2H6a1 1 0 110-2h2V6a1 1 0 012 0v2h2a1 1 0 110 2z" /></svg></div>
        <h2 className="font-serif text-lg font-bold text-[#3e2723]">Paglilinaw</h2>
      </div>
      <p className="p-4 bg-yellow-50 rounded-xl text-sm text-center text-[#5d4037]">🎲 Ipinapagawa ang dice rolling game para sa Kabanata 4-6. Coming soon!</p>
    </div>
  );
}