"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { CometCard } from "@/components/ui/comet-card";
import { EncryptedText } from "@/components/ui/encrypted-text";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { IconBrandGithub, IconBrandX, IconBrandLinkedin } from "@tabler/icons-react";

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

        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-4 sm:mt-6 max-w-2xl relative z-10 px-2">
          <EncryptedText
            text="Create Your Own Story."
            encryptedClassName="text-gray-500 dark:text-gray-500"
            revealedClassName="text-[#27B4F5] dark:text-[#27B4F5]"
            revealDelayMs={50}
          />
        </p>

        {/* CTA BUTTON - Moving Border */}
        <div className="relative z-10 mt-8 sm:mt-12 md:mt-14">
          <MovingBorderButton
            as={Link}
            href="/signup"
            borderRadius="1.75rem"
            containerClassName="h-12 sm:h-14 md:h-16 w-auto min-w-[200px] sm:min-w-[240px] md:min-w-[280px]"
            borderClassName="h-20 w-20 bg-[radial-gradient(#27B4F5_40%,transparent_60%)] opacity-[0.8]"
            className="bg-white/10 dark:bg-slate-900/80 text-black dark:text-white border-[#27B4F5]/50 dark:border-slate-800 px-8 sm:px-10 md:px-12 text-sm sm:text-base md:text-lg font-semibold hover:bg-[#27B4F5]/10 dark:hover:bg-[#27B4F5]/20 transition-colors duration-300"
          >
            🚀 Start Blogging Now
          </MovingBorderButton>
        </div>
      </section>

      {/* FEATURE CARDS with Comet Card Effect */}
      <section className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 z-10">
        {[
          {
            title: "Smart & Secure Sign-In",
            description: "Log in effortlessly using Google, LinkedIn, or your Zingg account credentials. Fast, secure authentication powered by NextAuth.",
            icon: "/icons/smartandsecure.svg",
          },
          {
            title: "Build Your Circle",
            description: "Follow creators you love and unfollow anytime. Curate your personalized feed with content that matters to you.",
            icon: "/icons/profile.svg",
          },
          {
            title: "Express & Engage",
            description: "Like posts, leave comments, and join conversations. Interact with the community and share your thoughts effortlessly.",
            icon: "/icons/ExpressandEngage.svg",
          },
          {
            title: "Discover What's Trending",
            description: "Explore fresh blog posts from across the community. Discover new creators, ideas, and inspiration in your feed.",
            icon: "/icons/trending-up-svgrepo-com.svg",
          },
          {
            title: "Share Your Moments",
            description: "Create rich blog posts with titles, content, photos, and videos. Mention friends with @mentions and bring your stories to life.",
            icon: "/icons/shareyourmoments.svg",
          },
          {
            title: "Make Your Profile Shine",
            description: "Customize your profile picture, bio, and details. Build a profile that truly represents who you are on Zingg.",
            icon: "/icons/prof.svg",
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
              <div className="mb-3 sm:mb-4 flex items-center justify-start">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                />
              </div>
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

      {/* Footer with Follow Us Section */}
      <footer className="relative z-10 w-full pb-8 sm:pb-12 md:pb-16 pt-8">
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#27B4F5] 
            drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
            Follow Us
          </h2>
          <FloatingDock
            items={[
              {
                title: "Twitter",
                icon: (
                  <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "https://x.com/toxx033?s=11",
              },
              {
                title: "LinkedIn",
                icon: (
                  <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "https://www.linkedin.com/in/sanidhya-singh-221b40293/",
              },
              {
                title: "Instagram",
                icon: (
                  <svg
                    className="h-full w-full text-neutral-500 dark:text-neutral-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ),
                href: "https://www.instagram.com/sanidhya.singh12?igsh=MWJ6czllandjbDNqMw==",
              },
              {
                title: "GitHub",
                icon: (
                  <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
                ),
                href: "https://github.com/ssk033",
              },
            ]}
            mobileClassName="translate-y-0"
          />
        </div>
      </footer>
    </div>
  );
}
