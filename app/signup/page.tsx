"use client";

import Signup from "@/components/Signup";
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
    <main className="relative h-screen w-screen bg-white dark:bg-black overflow-hidden flex items-center justify-center">
      {/* Subtle gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#27B4F5]/5 via-transparent to-transparent pointer-events-none" />

      {/* Animated grid background pattern */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(12,minmax(0,1fr))] sm:grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(8,minmax(0,1fr))] sm:grid-rows-[repeat(10,minmax(0,1fr))] md:grid-rows-[repeat(12,minmax(0,1fr))] opacity-30 dark:opacity-60"
      >
        {Array.from({ length: 216 }).map((_, i) => (
          <div
            key={i}
            className="cell border border-gray-300 dark:border-white/10 transition-all duration-300 ease-out hover:border-[#27B4F5]/30 dark:hover:border-white/20"
          />
        ))}
      </div>

      {/* Centered signup form card */}
      <Signup />
    </main>
  );
}
