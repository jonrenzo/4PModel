"use client";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url(/noli_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay — fixed so it always covers full viewport */}
      <div className="fixed inset-0 bg-black/40 pointer-events-none" />

      {/* Content — sits above overlay */}
      <div className="relative z-10 w-full px-6 pb-6 pt-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-2xl font-bold tracking-widest text-white">
            Tungkol sa App
          </h1>
        </div>

        {/* Content Container */}
        <div className="mb-4 overflow-hidden rounded-3xl border-4 border-[#8B4513] bg-[#efede6] shadow-2xl">
          <div className="items-center bg-[#8B4513] py-3 text-center">
            <h2 className="font-bold text-lg italic text-[#E8D4B0]">
              P4 MODEL
            </h2>
          </div>
          <div className="p-6">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-[#efede6] flex items-center justify-center overflow-hidden border border-[#8B4513]">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <p className="mb-6 text-justify text-sm leading-6 text-[#3e2723]">
              Isang digital na kasangkapan na idinisenyo upang linangin ang
              kakayahan ng mga mag-aaral sa masusing pang-unawa at pagsusuri ng
              Nobelang Noli Me Tangere. Sa pamamagitan ng mga gawaing nakatuon
              sa paghihinuha, paglilinaw, pagsisiyasat, at pagbubuod, inaasahang
              malinang ang kritikal na pag-iisip, mapalawak ang pananaw, at
              mapalalim ang kakayahang umunawa ng mga akdang pampanitikan.
              Layunin nitong gawing makabuluhan, makabago, at interaktibo ang
              karanasan sa pagkatuto sa pamamagitan ng digital na plataporma.
            </p>
            <div className="mb-6 h-[1px] w-full bg-[#3e2723]/20" />
            <p className="mb-3 font-bold text-base text-[#3e2723]">
              Mga Mananaliksik
            </p>
            <div className="mb-8 space-y-2">
              <p className="text-sm text-[#3e2723]">- Diaz, Althea Ashley O.</p>
              <p className="text-sm text-[#3e2723]">
                - Dombrique, Ashley Nicole D.
              </p>
              <p className="text-sm text-[#3e2723]">- Gonzalez, Justine</p>
              <p className="text-sm text-[#3e2723]">- King, Sheena N.</p>
              <p className="text-sm text-[#3e2723]">- Torio, Princess B.</p>
            </div>
            <p className="mb-3 font-bold text-base text-[#3e2723]">Bersyon</p>
            <p className="mb-4 text-sm text-[#3e2723]">v1.0.0 (Alpha)</p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => router.push("/student")}
          className="w-full rounded-full border-2 border-[#3e2723] bg-[#f5c170] py-4 shadow-lg font-bold text-xl uppercase tracking-wider text-[#3e2723]"
        >
          MAGPATULOY
        </button>
      </div>
    </div>
  );
}
