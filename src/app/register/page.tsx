"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    grade: "",
    section: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Paki-enter ang pangalan.");
      setLoading(false);
      return;
    }

    if (!formData.email.trim() || !formData.password) {
      setError("Paki-enter ang email at password.");
      setLoading(false);
      return;
    }

    if (!formData.grade.trim() || !formData.section.trim()) {
      setError("Paki-enter ang baitang at seksyon.");
      setLoading(false);
      return;
    }

    if (agreed === false) {
      setError("Kinakailangan mong sumang-ayon sa mga tuntunin.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Hindi tumutugma ang password.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Dapat ang password ay Hindi bababa sa 6 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      options: {
        data: {
          name: formData.name.trim(),
          grade: formData.grade.trim(),
          section: formData.section.trim(),
          role: formData.role,
        },
      },
    });

    if (signupError) {
      let errorMessage = "Hindi nakarehistro. Pakisubukan muli.";
      if (signupError.message.includes("already registered")) {
        errorMessage = "Ang email na ito ay naka-register na.";
      }
      setError(errorMessage);
      setLoading(false);
    } else {
      if (data.user) {
        alert("Matagumpay na nakarehistro!");
        router.push("/login");
      }
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      style={{
        backgroundImage: "url(/bg_login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-yellow-900/60" />
      <div className="relative flex h-[600px] w-[900px] overflow-hidden rounded-3xl bg-[#efede6] shadow-2xl">
        <div className="hidden w-1/2 items-center justify-center bg-[#4f2b21] p-8 lg:flex">
          <div className="text-center">
            <h1
              className="text-white drop-shadow-lg"
              style={{
                fontSize: 72,
                lineHeight: 80,
                fontFamily: "Great Vibes, cursive",
              }}
            >
              Noli Me Tangere
            </h1>
            <p className="mt-4 text-xl font-bold text-[#e8d4b0]">
              Filipino Reading App
            </p>
            <p className="mt-8 text-sm text-[#a89070]">
              Isang makulay na paglalakbay sa mundong may sakit sa lipunan
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col justify-center px-12 py-8 lg:w-1/2">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 text-center lg:hidden">
              <h1
                className="text-white drop-shadow-lg"
                style={{
                  fontSize: 48,
                  lineHeight: 54,
                  fontFamily: "Great Vibes, cursive",
                }}
              >
                Noli Me Tangere
              </h1>
              <p className="mt-2 font-bold text-white">Filipino Reading App</p>
            </div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#4f2b21]">
                Gumawa ng Account
              </h2>
              <p className="mt-2 text-sm text-[#6d4c41]">
                Ilagay ang inyong mga impormasyon upang makapagsimula
              </p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Pangalan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                  required
                />
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 pr-12 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#8d6e63" />
                    ) : (
                      <Eye size={20} color="#8d6e63" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmahin ang Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 pr-12 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#8d6e63" />
                    ) : (
                      <Eye size={20} color="#8d6e63" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Baitang"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className="flex-1 rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Seksyon"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="flex-1 rounded-xl border-2 border-[#8B4513] bg-white px-4 py-3 text-base text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-all ${
                    formData.role === "student"
                      ? "border-[#4f2b21] bg-[#4f2b21] text-white"
                      : "border-[#8B4513] bg-transparent text-[#4f2b21]"
                  }`}
                >
                  Mag-aaral
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold transition-all ${
                    formData.role === "teacher"
                      ? "border-[#4f2b21] bg-[#4f2b21] text-white"
                      : "border-[#8B4513] bg-transparent text-[#4f2b21]"
                  }`}
                >
                  Guro
                </button>
              </div>
              {error && (
                <p className="text-center text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border-2 border-[#4f2b21] bg-[#f5c170] py-3 text-lg font-bold uppercase tracking-wider text-[#3e2723] shadow-lg transition-all hover:bg-[#e5b160] disabled:opacity-50"
              >
                {loading ? "Loading..." : "REGISTER"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                className="text-xs font-bold text-[#6d4c41] underline"
                onClick={() => {
                  const response = confirm(
                    "Ako ay pumapayag sa mga tuntunin at kondisyon",
                  );
                  setAgreed(response);
                }}
              >
                Mga Tuntunin at Kondisyon
              </button>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-[#6d4c41]">
                May account na?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#4f2b21] underline"
                >
                  Mag-login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
