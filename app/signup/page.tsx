"use client";

import Signup from "@/components/Signup";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SignupPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = grid.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener("mousemove", () => {
        const randomColor = `hsl(${Math.random() * 360}, 100%, 55%)`;

        cell.setAttribute(
          "style",
          `
            background-color: ${randomColor};
            box-shadow:
              0 0 10px ${randomColor},
              0 0 25px ${randomColor},
              inset 0 0 15px ${randomColor};
          `
        );

        setTimeout(() => {
          cell.removeAttribute("style");
        }, 350);
      });
    });
  }, []);

  return (
    <main className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center">

      {/* ✅ Neon Grid Background — Symmetric */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))]"
      >
        {Array.from({ length: 216 }).map((_, i) => (
          <div
            key={i}
            className="cell border border-white/10 transition-all duration-75"
          />
        ))}
      </div>

      {/* ✅ Center Signup Card */}
   
               <Signup />
      
       
       
    </main>
  );
}
