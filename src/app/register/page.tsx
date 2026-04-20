"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";

const STEPS = [
  { number: 1, label: "Pagkakakilanlan", sublabel: "Pangalan at email" },
  { number: 2, label: "Seguridad", sublabel: "Password ng account" },
  { number: 3, label: "Impormasyon", sublabel: "Baitang, seksyon, at papel" },
];

function getActiveStep(formData: any, confirmPassword: string) {
  if (!formData.name && !formData.email) return 1;
  if (formData.name || formData.email) {
    if (!formData.password && !confirmPassword) return 2;
    if (formData.password || confirmPassword) return 3;
  }
  return 1;
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeStep = getActiveStep(formData, formData.confirmPassword);

  const isStepDone = (n: number) => {
    if (n === 1) return !!formData.name.trim() && !!formData.email.trim();
    if (n === 2) return !!formData.password && !!formData.confirmPassword;
    if (n === 3) return !!formData.grade.trim() && !!formData.section.trim();
    return false;
  };

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
      setError("Dapat ang password ay hindi bababa sa 6 characters.");
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
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
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .reg-panel { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
        .left-panel { animation: fadeIn 1s ease both; }

        .form-row { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
        .form-row:nth-child(1) { animation-delay: 0.1s; }
        .form-row:nth-child(2) { animation-delay: 0.18s; }
        .form-row:nth-child(3) { animation-delay: 0.26s; }
        .form-row:nth-child(4) { animation-delay: 0.34s; }
        .form-row:nth-child(5) { animation-delay: 0.42s; }
        .form-row:nth-child(6) { animation-delay: 0.50s; }
        .form-row:nth-child(7) { animation-delay: 0.58s; }
        .form-row:nth-child(8) { animation-delay: 0.66s; }

        .ornate-border { position: relative; }
        .ornate-border::before {
          content: '';
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(232,196,140,0.25);
          pointer-events: none;
          z-index: 0;
        }

        .divider {
          display: flex; align-items: center; gap: 10px; margin: 6px 0 20px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, #b8860b88, transparent);
        }
        .divider-diamond {
          width: 6px; height: 6px; background: #b8860b;
          transform: rotate(45deg); opacity: 0.7; flex-shrink: 0;
        }

        .parchment-input {
          width: 100%;
          background: #fdf8f0;
          border: 1px solid #c9a96e;
          border-bottom: 2px solid #8B5A2B;
          border-radius: 4px 4px 0 0;
          padding: 11px 16px;
          font-family: 'EB Garamond', serif;
          font-size: 1rem;
          color: #3e2723;
          transition: all 0.25s ease;
          outline: none;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }
        .parchment-input::placeholder {
          color: #a08060; font-style: italic;
        }
        .parchment-input:focus {
          background: #fffdf7;
          border-color: #8B5A2B;
          border-bottom-color: #4f2b21;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.07), 0 2px 0 #4f2b21;
        }

        .field-label {
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6b3a2a;
          margin-bottom: 6px;
        }

        .section-rule {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b8860b;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0 14px;
        }
        .section-rule::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #b8860b55, transparent);
        }

        .role-btn {
          flex: 1;
          padding: 10px 8px;
          border: 1px solid #c9a96e;
          border-bottom: 2px solid #8B5A2B;
          border-radius: 4px 4px 0 0;
          background: #fdf8f0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b3a2a;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .role-btn:hover {
          background: #f5ede0;
        }
        .role-btn.active {
          background: #4f2b21;
          border-color: #4f2b21;
          border-bottom-color: #b8860b;
          color: #f5e6c8;
          box-shadow: 0 2px 0 #b8860b;
        }

        .register-btn {
          position: relative;
          width: 100%;
          padding: 13px;
          background: #4f2b21;
          border: none;
          border-radius: 4px 4px 0 0;
          border-bottom: 2px solid #b8860b;
          color: #f5e6c8;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .register-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(245,193,112,0.2) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .register-btn:hover {
          background: #3a1e16;
          letter-spacing: 0.34em;
          box-shadow: 0 4px 20px rgba(79,43,33,0.35);
        }
        .register-btn:hover::before {
          opacity: 1;
          animation: shimmer 1.2s ease infinite;
        }
        .register-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .error-box {
          background: #fff5f5;
          border-left: 3px solid #c0392b;
          padding: 9px 14px;
          border-radius: 0 4px 4px 0;
          font-family: 'EB Garamond', serif;
          font-size: 0.92rem;
          color: #922b21;
          font-style: italic;
        }

        /* Step indicator */
        .step-item { display: flex; align-items: flex-start; gap: 16px; position: relative; }
        .step-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 15px;
          top: 34px;
          width: 1px;
          height: calc(100% + 8px);
          background: rgba(232,196,140,0.2);
        }
        .step-circle {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(232,196,140,0.3);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          color: rgba(232,196,140,0.4);
          transition: all 0.4s ease;
          position: relative; z-index: 1;
        }
        .step-circle.active {
          border-color: #f5c170;
          color: #f5c170;
          background: rgba(245,193,112,0.1);
          box-shadow: 0 0 12px rgba(245,193,112,0.2);
        }
        .step-circle.done {
          border-color: #b8860b;
          background: #b8860b;
          color: #3a1e16;
        }
        .step-circle.done .check-icon {
          animation: checkPop 0.35s cubic-bezier(.22,1,.36,1) both;
        }
        .step-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 600;
          transition: color 0.4s;
        }
        .step-sublabel {
          font-family: 'EB Garamond', serif;
          font-size: 0.8rem;
          font-style: italic;
          margin-top: 1px;
          transition: color 0.4s;
        }

        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px; z-index: 100;
        }
      `}</style>

      <div className="noise-overlay" />

      <div
        className="flex min-h-screen w-full items-center justify-center py-8"
        style={{
          backgroundImage: "url(/bg_login.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(60,25,10,0.45) 0%, rgba(30,10,5,0.75) 100%)",
          }}
        />

        <div
          className={`reg-panel relative flex w-full overflow-hidden m-4 ${mounted ? "" : "opacity-0"}`}
          style={{
            maxWidth: 920,
            borderRadius: 2,
            border: "1px solid rgba(184,134,11,0.3)",
            boxShadow:
              "0 0 0 1px rgba(184,134,11,0.1), 0 25px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          {/* Left panel — step indicator */}
          <div
            className="ornate-border left-panel hidden w-5/12 flex-col justify-between p-12 lg:flex"
            style={{
              background:
                "linear-gradient(160deg, #3a1e16 0%, #4f2b21 40%, #3a1e16 100%)",
              minHeight: 520,
            }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #f5c170 0px, #f5c170 1px, transparent 1px, transparent 12px)",
              }}
            />

            {/* Title */}
            <div className="relative z-10">
              <h1
                style={{
                  fontFamily: "Great Vibes, cursive",
                  fontSize: 62,
                  lineHeight: 1.1,
                  color: "#f5e6c8",
                  textShadow: "0 2px 20px rgba(245,193,112,0.2)",
                }}
              >
                Noli Me
                <br />
                Tangere
              </h1>
              <div className="divider" style={{ margin: "14px 0 0" }}>
                <div className="divider-diamond" />
              </div>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  color: "#c9a96e",
                  textTransform: "uppercase",
                  marginTop: 10,
                }}
              >
                Bagong Kabanata
              </p>
            </div>

            {/* Step indicators */}
            <div
              className="relative z-10"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 28,
                margin: "36px 0",
              }}
            >
              {STEPS.map((step) => {
                const done = isStepDone(step.number);
                const active = !done && activeStep === step.number;
                return (
                  <div key={step.number} className="step-item">
                    <div
                      className={`step-circle ${done ? "done" : active ? "active" : ""}`}
                    >
                      {done ? (
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="check-icon"
                        />
                      ) : (
                        <span>{step.number}</span>
                      )}
                    </div>
                    <div>
                      <div
                        className="step-label"
                        style={{
                          color: done
                            ? "#f5c170"
                            : active
                              ? "#f5e6c8"
                              : "rgba(232,196,140,0.35)",
                        }}
                      >
                        {step.label}
                      </div>
                      <div
                        className="step-sublabel"
                        style={{
                          color: done
                            ? "#c9a96e"
                            : active
                              ? "#a08060"
                              : "rgba(160,128,96,0.3)",
                        }}
                      >
                        {step.sublabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom quote */}
            <p
              className="relative z-10"
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: "0.88rem",
                color: "#7a5c3a",
                lineHeight: 1.7,
              }}
            >
              "Ang kabataan ang pag-asa ng bayan."
            </p>
          </div>

          {/* Right form panel */}
          <div
            className="flex w-full flex-col justify-center px-8 py-10 lg:px-12 lg:py-10 lg:w-7/12"
            style={{ background: "#faf6ee" }}
          >
            {/* Mobile title */}
            <div className="mb-6 text-center lg:hidden">
              <h1
                style={{
                  fontFamily: "Great Vibes, cursive",
                  fontSize: 48,
                  color: "#4f2b21",
                  lineHeight: 1.1,
                }}
              >
                Noli Me Tangere
              </h1>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                  color: "#8B5A2B",
                  textTransform: "uppercase",
                  marginTop: 6,
                }}
              >
                Filipino Reading App
              </p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block" style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  color: "#b8860b",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Gumawa ng Account
              </p>
              <h2
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  color: "#3a1e16",
                  lineHeight: 1.2,
                  marginBottom: 6,
                }}
              >
                Ilagay ang inyong impormasyon
              </h2>
              <div className="divider" style={{ margin: "12px 0 0" }}>
                <div className="divider-diamond" />
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Section 1 */}
              <div className="section-rule form-row">Pagkakakilanlan</div>

              <div className="form-row">
                <label className="field-label">Pangalan</label>
                <input
                  type="text"
                  placeholder="Juan dela Cruz"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="parchment-input"
                  required
                />
              </div>

              <div className="form-row">
                <label className="field-label">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="parchment-input"
                  required
                />
              </div>

              {/* Section 2 */}
              <div className="section-rule form-row">Seguridad</div>

              <div className="form-row">
                <label className="field-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="parchment-input"
                    style={{ paddingRight: 44 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9e7c5c",
                      display: "flex",
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="field-label">Konfirmahin ang Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulitin ang password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="parchment-input"
                    style={{ paddingRight: 44 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9e7c5c",
                      display: "flex",
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Section 3 */}
              <div className="section-rule form-row">Impormasyon</div>

              <div className="form-row" style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Baitang</label>
                  <input
                    type="text"
                    placeholder="Grade 9"
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    className="parchment-input"
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Seksyon</label>
                  <input
                    type="text"
                    placeholder="Rizal"
                    value={formData.section}
                    onChange={(e) =>
                      setFormData({ ...formData, section: e.target.value })
                    }
                    className="parchment-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="field-label">Papel</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "student" })
                    }
                    className={`role-btn ${formData.role === "student" ? "active" : ""}`}
                  >
                    Mag-aaral
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "teacher" })
                    }
                    className={`role-btn ${formData.role === "teacher" ? "active" : ""}`}
                  >
                    Guro
                  </button>
                </div>
              </div>

              {error && <div className="form-row error-box">{error}</div>}

              <div className="form-row" style={{ marginTop: 4 }}>
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="register-btn"
                >
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {loading ? "Nagrerehistro…" : "Magrehistro"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer links */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                onClick={() => {
                  const response = confirm(
                    "Ako ay pumapayag sa mga tuntunin at kondisyon",
                  );
                  setAgreed(response);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "EB Garamond, serif",
                  fontSize: "0.82rem",
                  color: agreed === true ? "#b8860b" : "#9e7c5c",
                  textDecoration: "underline",
                  fontStyle: "italic",
                  transition: "color 0.2s",
                }}
              >
                {agreed === true
                  ? "✓ Nasang-ayunan ang mga Tuntunin"
                  : "Mga Tuntunin at Kondisyon"}
              </button>

              <p
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: "0.92rem",
                  color: "#7a5c4a",
                }}
              >
                May account na?{" "}
                <Link
                  href="/login"
                  style={{
                    color: "#4f2b21",
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "1px solid #b8860b",
                    paddingBottom: 1,
                    transition: "color 0.2s",
                  }}
                >
                  Mag-login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
