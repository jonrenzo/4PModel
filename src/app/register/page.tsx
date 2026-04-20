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
      className="min-h-screen relative"
      style={{
        backgroundImage: "url(/bg_login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-yellow-900/50" />

      <div className="relative flex min-h-screen flex-col overflow-auto py-12">
        {/* Header */}
        <div className="mb-6 items-center px-4">
          <h1
            className="text-center text-white drop-shadow-lg"
            style={{
              fontSize: 64,
              lineHeight: 70,
              fontFamily: "Great Vibes, cursive",
            }}
          >
            Noli Me Tangere
          </h1>
          <p className="py-2 text-center font-bold text-white shadow-lg">
            Paghihinuha, Paglilinaw, Pagsisiyasat, at Pagbubuod
          </p>
          <div className="mt-4">
            <p className="text-center text-lg font-bold text-white">
              Gumawa ng Account
            </p>
            <p className="px-4 text-center text-sm text-white opacity-80">
              Ilagay ang inyong mga impormasyon upang makapagsimula
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="mx-4 w-auto space-y-3">
          <input
            type="text"
            placeholder="Pangalan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mb-2 w-full rounded-full border-2 border-[#3e2723] bg-[#efede6] px-6 py-3 text-center font-bold text-[#3e2723] shadow-sm"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mb-2 w-full rounded-full border-2 border-[#3e2723] bg-[#efede6] px-6 py-3 text-center font-bold text-[#3e2723] shadow-sm"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mb-2 w-full rounded-full border-2 border-[#3e2723] bg-[#efede6] px-6 py-3 pr-12 text-center font-bold text-[#3e2723] shadow-sm"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={24} color="#3e2723" />
              ) : (
                <Eye size={24} color="#3e2723" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmahin ang Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="mb-2 w-full rounded-full border-2 border-[#3e2723] bg-[#efede6] px-6 py-3 pr-12 text-center font-bold text-[#3e2723] shadow-sm"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={24} color="#3e2723" />
              ) : (
                <Eye size={24} color="#3e2723" />
              )}
            </button>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Baitang"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              className="mb-2 flex-1 rounded-full border-2 border-[#3e2723] bg-[#efede6] px-4 py-3 text-center font-bold text-[#3e2723] shadow-sm"
              required
            />
            <input
              type="text"
              placeholder="Seksyon"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className="mb-2 flex-1 rounded-full border-2 border-[#3e2723] bg-[#efede6] px-4 py-3 text-center font-bold text-[#3e2723] shadow-sm"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "student" })}
              className={`flex-1 rounded-full border-2 py-2 font-bold ${
                formData.role === "student"
                  ? "border-[#3e2723] bg-[#3e2723] text-white"
                  : "border-white bg-transparent text-white"
              }`}
            >
              Mag-aaral
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "teacher" })}
              className={`flex-1 rounded-full border-2 py-2 font-bold ${
                formData.role === "teacher"
                  ? "border-[#3e2723] bg-[#3e2723] text-white"
                  : "border-white bg-transparent text-white"
              }`}
            >
              Guro
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border-2 border-[#3e2723] bg-[#f5c170] py-4 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="text-center font-bold text-[#3e2723]">
                Loading...
              </span>
            ) : (
              <span className="block text-center text-xl font-bold uppercase tracking-widest text-[#3e2723]">
                REGISTER
              </span>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 items-center">
          <button
            className="font-bold text-sm text-white underline opacity-80"
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

        <div className="mt-4 items-center pb-8">
          <Link href="/login">
            <p className="font-bold text-sm text-white">
              May account na? <span className="underline">Mag-login</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
