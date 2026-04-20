"use client";

import { useState } from "react";

const characters = [
  {
    id: 1,
    name: "Don Crisostomo Magsalin Ibarra",
    image: "/ibarra.png",
    description:
      "Binatang nag-aral sa Europa na nangarap makapagpatayo ng paaralan upang matiyak ang magandang kinabukasan ng kabataan ng San Diego. Siya ay kababata at kasintahan ni Maria Clara.",
  },
  {
    id: 2,
    name: "Maria Clara delos Santos",
    image: "/maria.png",
    description:
      "Siya ang kasintahan ni Crisostomo Ibarra na kumakatawan sa isang uri ng Pilipinang lumaki sa kumbento at nagkaroon ng edukasyong nakasalig sa doktrina ng relihiyon.",
  },
  {
    id: 3,
    name: "Padre Damaso",
    image: "/damaso.png",
    description:
      "Isang kurang Pransiskano na dating kura ng San Diego at siya ring nagpahukay at nagpalipat sa bangkay ni Don Rafael Ibarra sa libingan ng mga Intsik.",
  },
  {
    id: 4,
    name: "Don Santiago 'Kapitan Tiyago' delos Santos",
    image: "/tiago.png",
    description:
      "Isang mayamang mangangalakal na taga-Binondo na asawa ni Pia Alba at ama ni Maria Clara. Siya ay isang taong mapagpanggap at laging masunurin sa nakatataas.",
  },
  {
    id: 5,
    name: "Don Rafael Ibarra",
    image: "/don.png",
    description:
      "Ama ni Crisostomo Ibarra na namatay sa bilangguan. Siya ay labis na kinainggitan ni Padre Damaso dahil sa yaman na kanyang tinataglay.",
  },
  {
    id: 6,
    name: "Padre Hernando Sibyla",
    image: "/hernando.png",
    description:
      "Isang paring Dominikano na lihim na sumusubaybay sa bawat kilos ni Crisostomo Ibarra.",
  },
  {
    id: 7,
    name: "Tiya Isabel",
    image: "/tiya.png",
    description:
      "Siya ang hipag ni Kapitan Tiago na nag-alaga kay Maria Clara simula nang siya ay sanggol pa lamang.",
  },
  {
    id: 8,
    name: "Donya Pia Alba delos Santos",
    image: "/pia.png",
    description:
      "Siya ang ina ni Maria Clara na sa loob ng anim na taon ng kanilang pagsasama ng kanyang kabiyak na si Kapitan Tiago ay hindi nagkaanak. Siya ay namatay matapos maisilang si Maria Clara.",
  },
  {
    id: 9,
    name: "Alperes",
    image: "/alp.png",
    description:
      "Siya ang pinuno ng mga guwardiya sibil at siya rin ay mahigpit na kaagaw ng kura sa kapangyarihan sa San Diego.",
  },
  {
    id: 10,
    name: "Tenyente Guevarra",
    image: "/guev.png",
    description:
      "Isa sa matapat na kaibigan ni Don Rafael Ibarra. Siya rin ang tenyente ng guardia civil na nagkuwento kay Crisostomo Ibarra ng totoong sinapit ng kaniyang ama.",
  },
];

export default function CharactersPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleDescription = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#4f2b21] p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-xl font-bold tracking-wide text-[#f5f5f5]">
          Mga Tauhan
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#bcaaa4] mt-1">
          Kabanata 1 - 6
        </p>
      </div>

      {/* Main Content Container */}
      <div className="min-h-[calc(100vh-180px)] overflow-hidden rounded-lg bg-[#efede6] shadow-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((char) => {
            const isExpanded = expandedId === char.id;

            return (
              <button
                key={char.id}
                onClick={() => toggleDescription(char.id)}
                className={`overflow-hidden rounded-2xl border border-[#d7ccc8] bg-white shadow-sm transition-all text-left ${
                  isExpanded ? "ring-2 ring-[#8B4513]" : ""
                }`}
              >
                <div className="flex items-center p-4">
                  {/* Portrait Frame */}
                  <div className="relative">
                    <div className="h-24 w-20 overflow-hidden rounded-lg border-[3px] border-[#b8860b] bg-[#4a342e] shadow-md">
                      <img
                        src={char.image}
                        alt={char.name}
                        className="h-full w-full opacity-90 object-cover"
                      />
                    </div>
                    {/* Decorative corner dots */}
                    <div className="absolute left-0 top-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                    <div className="absolute right-0 top-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                    <div className="absolute bottom-0 left-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                    <div className="absolute bottom-0 right-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                  </div>

                  {/* Name & Hint */}
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-lg leading-6 text-[#3e2723]">
                      {char.name}
                    </h3>
                    {!isExpanded && (
                      <p className="text-[10px] italic text-[#8d6e63]">
                        Pindutin upang makilala...
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-0">
                    <div className="mb-3 h-[1px] w-full bg-[#d7ccc8] opacity-50" />
                    <p className="text-justify text-sm leading-6 text-[#5d4037]">
                      {char.description}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}