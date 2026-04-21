"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  ClipboardList,
  User,
  Info,
  LogOut,
  BookMarked,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/student", icon: Home, label: "Home" },
  { href: "/student/characters", icon: Users, label: "Mga Tauhan" },
  { href: "/student/activities", icon: ClipboardList, label: "Mga Gawain" },
  { href: "/student/profile", icon: User, label: "Profile" },
  { href: "/student/about", icon: Info, label: "Tungkol sa App" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [className, setClassName] = useState<string | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("class_id, classes(name)")
        .eq("id", user.id)
        .single();
      if (profile?.classes) {
        setClassName((profile.classes as any).name ?? null);
      }
    };
    fetchClass();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#4f2b21] flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#5d4037] flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-[#efede6] flex items-center justify-center overflow-hidden border border-[#5d4037] mb-3">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h1
          className="text-center text-white"
          style={{
            fontSize: 24,
            fontFamily: "Great Vibes, cursive",
          }}
        >
          Noli Me Tangere
        </h1>
        {className && (
          <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-[#5d4037] px-3 py-1.5">
            <GraduationCap size={12} className="text-[#d4af37]" />
            <span className="text-xs font-medium text-[#e8d4b0] truncate">{className}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 mx-3 my-1 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#5d4037] text-[#f5c170]"
                  : "text-[#bcaaa4] hover:bg-[#5d4037] hover:text-white"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#5d4037]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-lg bg-[#5d4037] py-3 text-[#e8d4b0] transition-colors hover:bg-[#6d4c41]"
        >
          <LogOut size={18} className="mr-2" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

