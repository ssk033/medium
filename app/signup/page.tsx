"use client";

import Signup from "@/components/Signup";
import Image from "next/image";  // 👉 add this
import { useEffect, useRef } from "react";

export default function SignupPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleHover = (e: MouseEvent) => {
      const randomColor = `hsl(${Math.random() * 360}, 100%, 55%)`; // ⚡ BRIGHT NEON COLOR
      const target = e.target as HTMLElement;

      if (target.classList.contains("cell")) {
        target.style.backgroundColor = randomColor;
        target.style.boxShadow = `
          0px 0px 35px ${randomColor},
          0px 0px 90px ${randomColor},
          inset 0 0 25px ${randomColor}
        `;

        setTimeout(() => {
          target.style.backgroundColor = "transparent";
          target.style.boxShadow = "none";
        }, 300);
      }
    };

    grid.addEventListener("mousemove", handleHover);
    return () => grid.removeEventListener("mousemove", handleHover);
  }, []);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">

      {/* LEFT SIDE FORM */}
      <div className="w-1/2 flex items-center justify-center border-r border-gray-700">
        <Signup />
      </div>

      {/* RIGHT SIDE INTERACTIVE GRID PANEL */}
      <div className="relative w-1/2 flex items-center justify-center">

        {/* ✅ SUPER BRIGHT GRID */}
        <div
          ref={gridRef}
          className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-70"
        >
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="cell border border-white/25 transition-all duration-75"
            ></div>
          ))}
        </div>

        {/* NEON SVG LOGO + TEXT */}
        <div className="z-10 flex flex-col items-center gap-5 select-none">

          {/* ✅ SVG inserted here */}
          <Image
            src="/icons/writing-svgrepo-com.svg"
            alt="writing logo"
            width={120}
            height={120}
            className="drop-shadow-[0_0_35px_white] transition duration-300 hover:scale-110 hover:drop-shadow-[0_0_80px_white]"
          />

          <h1
            className="
              text-7xl font-black italic tracking-wide text-center
              drop-shadow-[0_0_30px_white]
              transition-all duration-300
              hover:drop-shadow-[0_0_60px_white]
              hover:tracking-widest hover:scale-110
            "
          >
            Create <br /> Your Own Story
          </h1>
        </div>

      </div>
    </div>
  );
}
