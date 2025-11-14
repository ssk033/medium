"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CometCard } from "@/components/ui/comet-card";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Home() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener("mousemove", () => {
        const neon = `hsl(${Math.random() * 360}, 100%, 55%)`;

        cell.setAttribute(
          "style",
          `
          background-color: ${neon};
          box-shadow:
            0 0 10px ${neon},
            0 0 25px ${neon},
            inset 0 0 15px ${neon};
        `
        );

        setTimeout(() => {
          cell.removeAttribute("style");
        }, 350);
      });
    });

    return () => {
      cells.forEach((cell) => {
        cell.removeEventListener("mousemove", () => {});
      });
    };
  }, []);

  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify-start overflow-visible relative bg-black">
      {/* ✅ Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#27B4F5]/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* ✅ Neon Grid Background with hover comet effect */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))] opacity-60 z-0"
      >
        {Array.from({ length: 216 }).map((_, i) => (
          <div 
            key={i} 
            className="cell border border-[#27B4F5]/10 hover:border-[#27B4F5]/30 transition-colors duration-300" 
          />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center pt-36 pb-28 px-6 select-none overflow-visible z-10">
        {/* ⭐ Background Lines with Text Hover Effect - ZINGG */}
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 h-[40rem]">
          <div className="relative z-20">
            <TextHoverEffect text="ZINGG" />
          </div>
        </BackgroundLines>

        <p className="text-gray-300 text-lg sm:text-xl md:text-2xl mt-6 max-w-2xl relative z-10">
          Create Your Own Story. Let&apos;s rewrite the past, redesign the present, redefine the future.
        </p>

        {/* CTA BUTTON - Animated Border Magic */}
        <Link href="/signup" className="relative z-10 mt-14">
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#27B4F5] focus:ring-offset-2 focus:ring-offset-black">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#27B4F5_0%,#00eeff_50%,#27B4F5_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-8 py-3 text-base font-semibold text-[#27B4F5] backdrop-blur-3xl hover:text-white transition-colors duration-300">
              🚀 Start Blogging Now
            </span>
          </button>
        </Link>
      </section>

      {/* REVIEW CARDS with Comet Card Effect */}
      <section className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 pb-20 z-10">
        {[ 
          "Super clean and fast UI. Feels better than Medium.",
          "Loved the minimal UI. Posting is super easy.",
          "Exactly what I needed for personal content posting!",
        ].map((text, i) => (
          <CometCard key={i}>
            <div
              className="
                border border-[#27B4F5]/50 rounded-xl p-6 w-[330px]
                backdrop-blur-xl bg-[#0B0E10]/70
                shadow-[0_0_30px_rgba(39,180,245,0.6)]
                hover:shadow-[0_0_65px_rgba(39,180,245,1)]
                transition-all duration-300
              "
            >
              <p className="text-sm text-gray-300">{text}</p>
              <h3 className="mt-3 font-semibold text-lg text-[#27B4F5]">⭐⭐⭐⭐⭐</h3>
              <p className="text-gray-400 mt-2 text-sm">
                – {["Rohan, Developer", "Sneha, Blogger", "Arjun, UI/UX Designer"][i]}
              </p>
            </div>
          </CometCard>
        ))}
      </section>
    </div>
  );
}
