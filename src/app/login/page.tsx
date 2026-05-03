"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Download } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");

  useEffect(() => {
    setMounted(true);
  }, []);

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
        const supabase2 = createClient();
        const {
          data: { user: loggedUser },
        } = await supabase2.auth.getUser();
        const storedRole = loggedUser?.user_metadata?.role ?? "student";

        if (storedRole !== role) {
          await supabase2.auth.signOut();
          const label = role === "teacher" ? "Guro" : "Mag-aaral";
          setError(
            `Ang account na ito ay hindi isang ${label}. Pumili ng tamang papel.`,
          );
          setLoading(false);
          return;
        }

        router.push(role === "teacher" ? "/teacher" : "/student");
      }
    } catch (err: any) {
      setError(err.message || "Hindi nakapag-login. Pakisubukan muli.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .login-panel {
          animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both;
        }
        .left-panel {
          animation: fadeIn 1s ease both;
        }
        .form-field {
          animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both;
        }
        .form-field:nth-child(1) { animation-delay: 0.15s; }
        .form-field:nth-child(2) { animation-delay: 0.25s; }
        .form-field:nth-child(3) { animation-delay: 0.35s; }
        .form-field:nth-child(4) { animation-delay: 0.45s; }

        .ornate-border {
          position: relative;
        }
        .ornate-border::before,
        .ornate-border::after {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(232, 196, 140, 0.3);
          pointer-events: none;
        }
        .ornate-border::after {
          inset: 18px;
          border-color: rgba(232, 196, 140, 0.15);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 6px 0 24px;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b8860b88, transparent);
        }
        .divider-diamond {
          width: 6px;
          height: 6px;
          background: #b8860b;
          transform: rotate(45deg);
          opacity: 0.7;
          flex-shrink: 0;
        }

        .parchment-input {
          width: 100%;
          background: #fdf8f0;
          border: 1px solid #c9a96e;
          border-bottom: 2px solid #8B5A2B;
          border-radius: 4px 4px 0 0;
          padding: 14px 18px;
          font-family: 'EB Garamond', serif;
          font-size: 1.05rem;
          color: #3e2723;
          transition: all 0.25s ease;
          outline: none;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
          box-sizing: border-box;
        }
        .parchment-input::placeholder {
          color: #a08060;
          font-style: italic;
        }
        .parchment-input:focus {
          background: #fffdf7;
          border-color: #8B5A2B;
          border-bottom-color: #4f2b21;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.08), 0 2px 0 #4f2b21;
        }

        .login-btn {
          position: relative;
          width: 100%;
          padding: 15px;
          background: #4f2b21;
          border: none;
          border-radius: 4px;
          color: #f5e6c8;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(245,193,112,0.25) 50%,
            transparent 70%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .login-btn:hover {
          background: #3a1e16;
          box-shadow: 0 4px 20px rgba(79,43,33,0.4);
          letter-spacing: 0.32em;
        }
        .login-btn:hover::before {
          opacity: 1;
          animation: shimmer 1.2s ease infinite;
        }
        .login-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .login-btn .btn-accent {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #b8860b, #f5c170, #b8860b);
        }

        .error-box {
          background: #fff5f5;
          border-left: 3px solid #c0392b;
          padding: 10px 14px;
          border-radius: 0 4px 4px 0;
          font-family: 'EB Garamond', serif;
          font-size: 0.95rem;
          color: #922b21;
          font-style: italic;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px;
          z-index: 100;
        }
      `}</style>

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      <div
        className="relative flex min-h-screen w-full items-center justify-center"
        style={{
          backgroundImage: "url(/bg_login.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Warm vignette overlay */}
        <div
          className="fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(60,25,10,0.45) 0%, rgba(30,10,5,0.75) 100%)",
          }}
        />

        {/* Card */}
        <div
          className={`login-panel relative flex overflow-hidden shadow-2xl mx-auto my-8 ${mounted ? "" : "opacity-0"}`}
          style={{
            maxWidth: 920,
            width: "calc(100% - 32px)",
            borderRadius: 2,
            border: "1px solid rgba(184,134,11,0.3)",
            boxShadow:
              "0 0 0 1px rgba(184,134,11,0.1), 0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Left decorative panel */}
          <div
            className="ornate-border left-panel hidden w-1/2 items-center justify-center p-12 lg:flex"
            style={{
              background:
                "linear-gradient(160deg, #3a1e16 0%, #4f2b21 40%, #3a1e16 100%)",
            }}
          >
            {/* Subtle pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #f5c170 0px, #f5c170 1px, transparent 1px, transparent 12px)",
              }}
            />

            <div className="relative text-center z-10 px-6">
              {/* Top ornament */}
              <div style={{ marginBottom: 20, opacity: 0.5 }}>
                <svg
                  width="60"
                  height="16"
                  viewBox="0 0 60 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="8"
                    x2="22"
                    y2="8"
                    stroke="#f5c170"
                    strokeWidth="0.75"
                  />
                  <path d="M26 8 L30 3 L34 8 L30 13 Z" fill="#f5c170" />
                  <line
                    x1="38"
                    y1="8"
                    x2="60"
                    y2="8"
                    stroke="#f5c170"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>

              {/* Logo */}
              <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-[#efede6] flex items-center justify-center overflow-hidden border-2 border-[#f5c170] shadow-xl">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <h1
                style={{
                  fontFamily: "Great Vibes, cursive",
                  fontSize: 78,
                  lineHeight: 1.1,
                  color: "#f5e6c8",
                  textShadow: "0 2px 20px rgba(245,193,112,0.25)",
                  letterSpacing: "0.02em",
                }}
              >
                Noli Me
                <br />
                Tangere
              </h1>

              <div className="divider" style={{ margin: "18px 0" }}>
                <div className="divider-diamond" />
              </div>

              <p
                style={{
                  marginTop: 28,
                  fontFamily: "EB Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  color: "#9e7c5c",
                  lineHeight: 1.7,
                  maxWidth: 220,
                  margin: "28px auto 0",
                }}
              >
                "Ang hindi marunong magmahal sa sariling wika ay higit pa sa
                hayop at malansang isda"
              </p>

              {/* Bottom ornament */}
              <div style={{ marginTop: 24, opacity: 0.5 }}>
                <svg
                  width="60"
                  height="16"
                  viewBox="0 0 60 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="8"
                    x2="22"
                    y2="8"
                    stroke="#f5c170"
                    strokeWidth="0.75"
                  />
                  <path d="M26 8 L30 3 L34 8 L30 13 Z" fill="#f5c170" />
                  <line
                    x1="38"
                    y1="8"
                    x2="60"
                    y2="8"
                    stroke="#f5c170"
                    strokeWidth="0.75"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div
            className="flex w-full flex-col justify-center px-8 py-10 lg:px-14 lg:py-12 lg:w-1/2"
            style={{ background: "#faf6ee" }}
          >
            <div className="mx-auto w-full" style={{ maxWidth: 360 }}>
              {/* Mobile title */}
              <div className="mb-8 text-center lg:hidden">
                <div className="mb-4 flex justify-center">
                  <div className="h-18 w-18 rounded-full bg-[#efede6] flex items-center justify-center overflow-hidden border-2 border-[#4f2b21] shadow-lg">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <h1
                  style={{
                    fontFamily: "Great Vibes, cursive",
                    fontSize: 52,
                    color: "#4f2b21",
                    lineHeight: 1.1,
                  }}
                >
                  Noli Me Tangere
                </h1>
              </div>

              {/* Role toggle */}
              <div style={{ marginBottom: 28 }}>
                <p
                  style={{
                    fontFamily: "Poppins, serif",
                    fontSize: "0.78rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#6b3a2a",
                    marginBottom: 10,
                  }}
                >
                  Pumasok bilang
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    border: "1px solid #c9a96e",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  {(["student", "teacher"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: "11px 0",
                        fontFamily: "Poppins, serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "capitalize",
                        cursor: "pointer",
                        border: "none",
                        transition: "all 0.2s ease",
                        background: role === r ? "#4f2b21" : "#fdf8f0",
                        color: role === r ? "#f5e6c8" : "#7a5c4a",
                        borderRight:
                          r === "student" ? "1px solid #c9a96e" : "none",
                      }}
                    >
                      {r === "student" ? "Mag-aaral" : "Guro"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop heading */}
              <div className="hidden lg:block" style={{ marginBottom: 36 }}>
                <p
                  style={{
                    fontFamily: "Poppins, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.22em",
                    color: "#b8860b",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Maligayang Pagdating
                </p>
                <h2
                  style={{
                    fontFamily: "Poppins, serif",
                    fontSize: "2rem",
                    fontWeight: 600,
                    color: "#3a1e16",
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}
                >
                  Pumasok sa iyong Akawnt
                </h2>
                <div className="divider" style={{ margin: "14px 0 0" }}>
                  <div className="divider-diamond" />
                </div>
              </div>

              {/* Form */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div className="form-field">
                  <label
                    style={{
                      display: "block",
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "0.78rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#6b3a2a",
                      marginBottom: 8,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="parchment-input"
                    required
                  />
                </div>

                <div className="form-field">
                  <label
                    style={{
                      display: "block",
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "0.78rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "#6b3a2a",
                      marginBottom: 8,
                    }}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="parchment-input"
                      style={{ paddingRight: 48 }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 2,
                        color: "#9e7c5c",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="form-field error-box">{error}</div>}

                <div className="form-field" style={{ marginTop: 6 }}>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="login-btn"
                  >
                    <span style={{ position: "relative", zIndex: 1 }}>
                      {loading ? "Naglo-load…" : "Pumasok"}
                    </span>
                    <div className="btn-accent" />
                  </button>
                </div>
              </div>

              {/* Register link */}
              <div style={{ marginTop: 28, textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontSize: "0.95rem",
                    color: "#7a5c4a",
                  }}
                >
                  Wala pang account?{" "}
                  <Link
                    href="/register"
                    style={{
                      color: "#4f2b21",
                      fontWeight: 600,
                      textDecoration: "none",
                      borderBottom: "1px solid #b8860b",
                      paddingBottom: 1,
                      transition: "color 0.2s, border-color 0.2s",
                    }}
                  >
                    Mag-register
                  </Link>
                </p>
              </div>

              {/* Download Android App Button */}
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <a
                  href="/p4Modelv2.apk"
                  download
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(184, 134, 11, 0.1)",
                    border: "1px solid rgba(184, 134, 11, 0.4)",
                    color: "#4f2b21",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      "rgba(184, 134, 11, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "rgba(184, 134, 11, 0.1)";
                  }}
                >
                  <Download size={16} />
                  <span className="font-poppins">
                    I-download ang Android App
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
