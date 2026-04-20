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
} from "lucide-react";
import { createClient } from "@/lib/supabase";

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#4f2b21] flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#5d4037]">
        <h1
          className="text-center text-white"
          style={{
            fontSize: 32,
            fontFamily: "Great Vibes, cursive",
          }}
        >
          Noli Me Tangere
        </h1>
        <p className="text-center text-xs text-[#e8d4b0] mt-1">P4 Model Web</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 mx-3 rounded-lg transition-colors ${
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
