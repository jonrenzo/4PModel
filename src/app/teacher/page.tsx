"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Plus,
  LogOut,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: "none" | "confirm" | "error";
    classId?: string;
    className?: string;
  }>({ type: "none" });
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
    const name = prompt("Pangalan ng bagong klase:");
    if (!name) return;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from("classes")
      .insert({ teacher_id: user.id, name, invite_code: inviteCode })
      .select();
    if (!error && data) setClasses([...classes, data[0]]);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = async (cls: any) => {
    const supabase = createClient();
    const { count, error } = await supabase
      .from("class_enrollments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", cls.id);

    if (error) {
      console.error(error);
      return;
    }

    if (count && count > 0) {
      setModalState({ type: "error", classId: cls.id, className: cls.name });
    } else {
      setModalState({ type: "confirm", classId: cls.id, className: cls.name });
    }
  };

  const confirmDelete = async () => {
    if (!modalState.classId) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", modalState.classId);
    if (!error) {
      setClasses(classes.filter((c) => c.id !== modalState.classId));
    }
    setModalState({ type: "none" });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a1510",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap');
          @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
        `}</style>
        <div
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "1.1rem",
            letterSpacing: "0.2em",
            color: "#c9a96e",
            textTransform: "uppercase",
            animation: "pulse 1.8s ease infinite",
          }}
        >
          Naglo-load…
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .dash-root {
          min-height: 100vh;
          background: #2a1510;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.4s ease both;
        }

        .dash-header {
          background: linear-gradient(135deg, #3a1e16 0%, #4f2b21 60%, #3a1e16 100%);
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 68px;
          border-bottom: 2px solid #b8860b;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-logo {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #faf6ee;
          border: 2px solid #b8860b;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .logout-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(139,69,19,0.25);
          border: 1px solid rgba(184,134,11,0.25);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #c9a96e;
        }
        .logout-btn:hover {
          background: rgba(180,50,30,0.35);
          border-color: rgba(220,80,60,0.4);
          color: #ffb3a0;
        }

        .dash-body {
          flex: 1;
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
          padding: 28px 20px 48px;
        }

        .section-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.68rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #c9a96e;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .section-eyebrow::after {
          content: '';
          flex: 1; height: 1px;
          background: linear-gradient(90deg, #b8860b88, transparent);
        }

        .create-btn {
          width: 100%;
          padding: 15px 24px;
          background: #4f2b21;
          border: none;
          border-bottom: 2px solid #b8860b;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          margin-bottom: 32px;
          overflow: hidden;
          position: relative;
          animation: fadeUp 0.5s ease both;
          animation-delay: 0.1s;
        }
        .create-btn:hover {
          background: #3a1e16;
          box-shadow: 0 4px 20px rgba(79,43,33,0.3);
        }
        .create-btn-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5e6c8;
        }

        .empty-state {
          text-align: center;
          padding: 52px 24px;
          border: 1px dashed rgba(184,134,11,0.2);
          border-radius: 2px;
          background: rgba(58,30,22,0.4);
          animation: fadeUp 0.5s ease both;
          animation-delay: 0.2s;
        }
        .empty-icon {
          width: 48px; height: 48px;
          margin: 0 auto 16px;
          background: rgba(184,134,11,0.08);
          border: 1px solid rgba(184,134,11,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #b8860b;
        }

        .class-list { display: flex; flex-direction: column; gap: 14px; }

        .class-card {
          background: #3a1e16;
          border: 1px solid #6b3a2a;
          border-left: 4px solid #4f2b21;
          border-radius: 2px;
          padding: 20px 20px 16px;
          position: relative;
          transition: all 0.2s ease;
          animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .class-card::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 27px,
            rgba(184,134,11,0.04) 27px, rgba(184,134,11,0.04) 28px
          );
          pointer-events: none;
        }
        .class-card:hover {
          border-left-color: #b8860b;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          transform: translateY(-1px);
        }

        .class-number {
          position: absolute; top: 18px; right: 54px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 300;
          color: rgba(184,134,11,0.12);
          line-height: 1;
          user-select: none;
        }

        .delete-btn {
          position: absolute; top: 16px; right: 16px;
          background: rgba(180,50,30,0.15);
          border: 1px solid rgba(220,80,60,0.2);
          color: #ff8a66;
          width: 28px; height: 28px;
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; z-index: 10;
        }
        .delete-btn:hover {
          background: rgba(180,50,30,0.4);
          border-color: rgba(220,80,60,0.5);
          color: #ffb3a0;
        }

        .class-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #f5e6c8;
          line-height: 1.2;
          margin-bottom: 10px;
          padding-right: 48px;
          position: relative; z-index: 1;
        }

        .invite-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .invite-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.68rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: #c9a96e;
        }
        .invite-code {
          font-family: 'Courier New', monospace;
          font-size: 0.82rem; font-weight: bold;
          color: #f5e6c8; background: #4f2b21;
          padding: 3px 10px; letter-spacing: 0.1em;
          border-bottom: 1px solid #b8860b;
        }
        .copy-btn {
          background: none; border: none; cursor: pointer;
          color: #9e7c5c; display: flex; align-items: center;
          padding: 2px; transition: color 0.2s;
        }
        .copy-btn:hover { color: #b8860b; }
        .copy-btn.copied { color: #5a8a5a; }

        .card-divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(184,134,11,0.3), transparent);
          margin-bottom: 12px;
          position: relative; z-index: 1;
        }

        .view-btn {
          width: 100%;
          padding: 10px 16px;
          background: transparent;
          border: 1px solid #6b3a2a;
          border-bottom: 2px solid #b8860b;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #e8d4b0;
          position: relative; z-index: 1;
        }
        .view-btn:hover {
          background: #6b3a2a; color: #f5e6c8;
          border-color: #6b3a2a; border-bottom-color: #b8860b;
        }

        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px; z-index: 999;
        }
      `}</style>

      <div className="noise-overlay" />

      <div className="dash-root">
        {/* Header */}
        <header className="dash-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="header-logo">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "Great Vibes, cursive",
                  fontSize: "1.75rem",
                  color: "#f5e6c8",
                  lineHeight: 1,
                  textShadow: "0 1px 8px rgba(245,193,112,0.15)",
                }}
              >
                Noli Me Tangere
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c9a96e",
                  marginTop: 2,
                }}
              >
                Dashboard ng Guro
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: "0.8rem",
                  color: "#a08060",
                  fontStyle: "italic",
                }}
              >
                Magandang araw,
              </div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "#e8d4b0",
                }}
              >
                {profile?.name || "Guro"}
              </div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Mag-logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="dash-body">
          <button className="create-btn" onClick={handleCreateClass}>
            <Plus size={15} color="#f5c170" strokeWidth={2.5} />
            <span className="create-btn-label">Gumawa ng Bagong Klase</span>
          </button>

          <div className="section-eyebrow">
            Aking mga Klase ({classes.length})
          </div>

          {classes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <BookOpen size={20} />
              </div>
              <p
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "#c9a96e",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Wala pang klase.
                <br />
                Gumawa ng isa upang makapagsimula.
              </p>
            </div>
          ) : (
            <div className="class-list">
              {classes.map((cls, i) => (
                <div
                  key={cls.id}
                  className="class-card"
                  style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                >
                  <span className="class-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(cls)}
                    title="Burahin ang Klase"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="class-name">{cls.name}</div>

                  <div className="invite-row">
                    <span className="invite-label">Kodigo ng Paanyaya</span>
                    <span className="invite-code">{cls.invite_code}</span>
                    <button
                      className={`copy-btn ${copiedId === cls.id ? "copied" : ""}`}
                      onClick={() => handleCopy(cls.invite_code, cls.id)}
                      title="Kopyahin"
                    >
                      {copiedId === cls.id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                    {copiedId === cls.id && (
                      <span
                        style={{
                          fontFamily: "EB Garamond, serif",
                          fontSize: "0.75rem",
                          fontStyle: "italic",
                          color: "#5a8a5a",
                        }}
                      >
                        Nakopya!
                      </span>
                    )}
                  </div>

                  <div className="card-divider" />

                  <button
                    className="view-btn"
                    onClick={() => router.push(`/teacher/class/${cls.id}`)}
                  >
                    Tingnan ang Mga Mag-aaral
                    <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modals */}
        {modalState.type !== "none" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
            <div className="bg-[#f5ede0] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#c4b09a] relative">
              <button
                onClick={() => setModalState({ type: "none" })}
                className="absolute top-4 right-4 text-[#8d6e63] hover:text-[#3e2723]"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-xl ${modalState.type === "error" ? "bg-[#ffebeb]" : "bg-[#fff4e5]"}`}
                >
                  {modalState.type === "error" ? (
                    <AlertCircle size={24} className="text-[#d32f2f]" />
                  ) : (
                    <Trash2 size={24} className="text-[#ed6c02]" />
                  )}
                </div>
                <h3 className="text-base font-bold text-[#3e2723]">
                  {modalState.type === "error"
                    ? "Hindi Maaaring Burahin"
                    : "Kumpirmasyon"}
                </h3>
              </div>
              <p className="text-sm text-[#5d4037] mb-6 leading-relaxed">
                {modalState.type === "error" ? (
                  <>
                    Ang klaseng{" "}
                    <span className="font-bold text-[#3e2723]">
                      {modalState.className}
                    </span>{" "}
                    ay may mga estudyante pa. Kailangan munang maging blangko
                    ang klase bago ito mabura.
                  </>
                ) : (
                  <>
                    Sigurado ka bang nais mong burahin ang klaseng{" "}
                    <span className="font-bold text-[#3e2723]">
                      {modalState.className}
                    </span>
                    ? Hindi na ito maibabalik pa.
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setModalState({ type: "none" })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#c4b09a] text-[#5d4037] text-sm font-semibold hover:bg-[#ede0d4] transition-colors"
                >
                  {modalState.type === "error" ? "Isara" : "Kanselahin"}
                </button>
                {modalState.type === "confirm" && (
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#d32f2f] text-white text-sm font-bold hover:bg-[#b71c1c] transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Burahin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
