"use client";

import { useEffect, useRef } from "react";
import Signin from "@/components/Signin";

export default function SigninPage() {
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

    // Cleanup event listeners on unmount
    return () => {
      cells.forEach((cell) => {
        cell.removeEventListener("mousemove", () => {});
      });
    };
  }, []);

  return (
    <main className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Neon Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))]"
      >
        {Array.from({ length: 216 }).map((_, i) => (
          <div key={i} className="cell border border-white/10 transition-all duration-75" />
        ))}
      </div>

      {/* Centered Signin Card */}
      <Signin />
    </main>
  );
}
