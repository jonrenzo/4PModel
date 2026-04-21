"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Users, Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

        const { data: classesData } = await supabase
          .from("classes")
          .select("*")
          .eq("teacher_id", user.id);

        setClasses(classesData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateClass = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const name = prompt("Enter class name:");
    if (!name) return;

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: user.id,
        name,
        invite_code: inviteCode,
      })
      .select();

    if (!error && data) {
      setClasses([...classes, data[0]]);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#4f2b21]">
        <p className="text-[#E8D4B0]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4f2b21]">
      <header className="bg-[#5d4037] p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f5]">
            Teacher Dashboard
          </h1>
          <p className="text-[#E8D4B0]">Hi, {profile?.name || "Guro"}</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-red-800 rounded-full">
          <LogOut size={20} className="text-white" />
        </button>
      </header>

      <main className="p-4">
        <button
          onClick={handleCreateClass}
          className="w-full py-4 bg-[#f5c170] rounded-full font-bold text-[#3e2c2c] flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={20} />
          Gumawa ng Bagong Class
        </button>

        <h2 className="text-xl font-bold text-[#E8D4B0] mb-4">My Classes</h2>

        {classes.length === 0 ? (
          <p className="text-[#A89070] text-center">
            Wala pang class. Gumawa ng isa!
          </p>
        ) : (
          <div className="space-y-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-4 bg-[#efede6] rounded-xl border-2 border-[#8B4513]"
              >
                <h3 className="text-xl font-bold text-black">{cls.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Invite Code:</span>
                  <code className="bg-[#4f2b21] text-white px-2 py-1 rounded">
                    {cls.invite_code}
                  </code>
                </div>
                <button
                  onClick={() => router.push(`/teacher/class/${cls.id}`)}
                  className="mt-3 w-full py-2 bg-[#4f2b21] text-white rounded-full hover:bg-[#3e2723] transition-colors font-medium text-sm"
                >
                  Tingnan ang Mag-aaral
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
