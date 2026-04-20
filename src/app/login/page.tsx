"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error("Login error:", error);
        let errorMessage = "Hindi nakapag-login. Pakisubukan muli.";
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Hindi tamang email o password.";
        } else if (error.message.includes("Network")) {
          errorMessage = "May problema sa internet connection.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Hindi pa na-confirm ang email. Paki-check ang inbox.";
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
        setLoading(false);
      } else {
        console.log("Login success:", data.user);
        router.push("/student");
      }
    } catch (err: any) {
      console.error("Login exception:", err);
      setError(err.message || "Hindi nakapag-login. Pakisubukan muli.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{
        backgroundImage: "url(/bg_login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-yellow-900/60" />
      <div className="relative flex w-full max-w-screen overflow-hidden rounded-3xl bg-[#efede6] shadow-2xl m-4">
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
        <div className="flex w-full flex-col justify-center px-8 py-6 lg:px-12 lg:py-8 lg:w-1/2">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
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
            <div className="mb-10 hidden text-center lg:block">
              <h2 className="text-2xl font-bold text-[#4f2b21]">
                Maligayang Pagdating
              </h2>
              <p className="mt-2 text-[#6d4c41]">
                Pumasok sa iyong account upang magpatuloy
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4f2b21]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-5 py-4 text-lg text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#4f2b21]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-[#8B4513] bg-white px-5 py-4 pr-14 text-lg text-[#3e2723] placeholder-[#8d6e63] focus:border-[#4f2b21] focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={22} color="#8d6e63" />
                    ) : (
                      <Eye size={22} color="#8d6e63" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-center text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border-2 border-[#4f2b21] bg-[#f5c170] py-4 text-xl font-bold uppercase tracking-wider text-[#3e2723] shadow-lg transition-all hover:bg-[#e5b160] disabled:opacity-50"
              >
                {loading ? "Loading..." : "LOGIN"}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-[#6d4c41]">
                Wala pang account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#4f2b21] underline"
                >
                  Mag-register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
