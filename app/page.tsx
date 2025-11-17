"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CometCard } from "@/components/ui/comet-card";
import { EncryptedText } from "@/components/ui/encrypted-text";

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
    <div className="min-h-screen w-full text-gray-800 dark:text-white flex flex-col items-center justify-start overflow-visible relative bg-white dark:bg-black">
      {/* Subtle gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#27B4F5]/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* Animated grid background with interactive hover effects */}
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-[repeat(12,minmax(0,1fr))] sm:grid-cols-[repeat(15,minmax(0,1fr))] md:grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(8,minmax(0,1fr))] sm:grid-rows-[repeat(10,minmax(0,1fr))] md:grid-rows-[repeat(12,minmax(0,1fr))] opacity-30 dark:opacity-60 z-0"
      >
        {Array.from({ length: 216 }).map((_, i) => (
          <div 
            key={i} 
            className="cell border border-[#27B4F5]/10 hover:border-[#27B4F5]/30 transition-colors duration-300" 
          />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 select-none overflow-visible z-10">
        {/* ⭐ Text Hover Effect with ZINGG */}
        <div className="h-[20rem] sm:h-[30rem] md:h-[40rem] flex items-center justify-center w-full">
          <TextHoverEffect text="ZINGG" />
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-4 sm:mt-6 max-w-2xl relative z-10 px-2">
          <EncryptedText
            text="Create Your Own Story."
            encryptedClassName="text-gray-500 dark:text-gray-500"
            revealedClassName="text-gray-600 dark:text-gray-300"
            revealDelayMs={50}
          />
        </p>

        {/* CTA BUTTON - Animated Border Magic */}
        <Link href="/signup" className="relative z-10 mt-8 sm:mt-12 md:mt-14">
          <button className="relative inline-flex h-10 sm:h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-[#27B4F5] focus:ring-offset-2 focus:ring-offset-black">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#27B4F5_0%,#00eeff_50%,#27B4F5_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold text-[#27B4F5] backdrop-blur-3xl hover:text-white transition-colors duration-300">
              🚀 Start Blogging Now
            </span>
          </button>
        </Link>
      </section>

      {/* FEATURE CARDS with Comet Card Effect */}
      <section className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 z-10">
        {[
          {
            title: "Smart & Secure Sign-In",
            description: "Log in effortlessly using Google, LinkedIn, or your own Zing account — fast, secure, and built for speed.",
            icon: "🔐",
          },
          {
            title: "Build Your Circle",
            description: "Follow the people you vibe with and unfollow anytime. Curate your perfect social feed.",
            icon: "👥",
          },
          {
            title: "Express & Engage",
            description: "Drop likes, share your thoughts, and join the conversation — interaction made simple.",
            icon: "💬",
          },
          {
            title: "Discover What's Trending",
            description: "Explore fresh posts from across the community. Find new creators, ideas, and inspiration.",
            icon: "🔥",
          },
          {
            title: "Share Your Moments",
            description: "Create posts with photos, videos, and tags. Bring your world to life with just a tap.",
            icon: "📸",
          },
          {
            title: "Make Your Profile Shine",
            description: "Customize your bio, photo, and details — build a profile that truly reflects you.",
            icon: "✨",
          },
        ].map((feature, i) => (
          <CometCard key={i}>
            <div
              className="
                border border-[#27B4F5]/50 rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-[450px]
                backdrop-blur-xl bg-[#0B0E10]/70
                shadow-[0_0_30px_rgba(39,180,245,0.6)]
                hover:shadow-[0_0_65px_rgba(39,180,245,1)]
                transition-all duration-300
                h-full flex flex-col
              "
            >
              <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#27B4F5] mb-2 sm:mb-3
                drop-shadow-[0_0_10px_#27B4F5/50]">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </div>
          </CometCard>
        ))}
      </section>
    </div>
  );
}
