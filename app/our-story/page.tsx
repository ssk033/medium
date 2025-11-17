"use client";

import { useEffect, useRef } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandGithub, IconBrandX, IconBrandLinkedin } from "@tabler/icons-react";
import Image from "next/image";

export default function OurStoryPage() {
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

  // Social media links
  const socialLinks = [
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
  ];

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

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-4xl px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-20 md:mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8
            bg-gradient-to-r from-[#27B4F5] to-[#00eeff]
            bg-clip-text text-transparent
            drop-shadow-[0_0_45px_rgba(39,180,245,0.8)]">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome to ZINGG - Where stories come to life
          </p>
        </section>

        {/* Story Content */}
        <section className="space-y-8 sm:space-y-10 md:space-y-12">
          <div className="
            rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10
            backdrop-blur-[20px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/80 dark:via-[#0B0E10]/75 dark:to-[#0B0E10]/80
            border border-[#27B4F5]/40
            shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-500 ease-out
          ">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#27B4F5] mb-4 sm:mb-6
              drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
              The Beginning
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              ZINGG was born from a simple idea: everyone has a story worth telling. 
              In a world where content creation has become complex and overwhelming, 
              we wanted to create a platform that makes sharing your thoughts, ideas, 
              and experiences as simple and beautiful as possible.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Our mission is to empower creators, writers, and storytellers to express 
              themselves freely without the noise and distractions of traditional social media.
            </p>
          </div>

          <div className="
            rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10
            backdrop-blur-[20px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/80 dark:via-[#0B0E10]/75 dark:to-[#0B0E10]/80
            border border-[#27B4F5]/40
            shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-500 ease-out
          ">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#27B4F5] mb-4 sm:mb-6
              drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
              What Makes Us Different
            </h2>
            <ul className="space-y-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-[#27B4F5] text-xl mt-1">✨</span>
                <span>Clean, minimal interface that puts your content first</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#27B4F5] text-xl mt-1">🚀</span>
                <span>Lightning-fast performance for seamless writing experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#27B4F5] text-xl mt-1">🎨</span>
                <span>Beautiful design that adapts to your style</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#27B4F5] text-xl mt-1">💬</span>
                <span>Engage with your community through comments and interactions</span>
              </li>
            </ul>
          </div>

          <div className="
            rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10
            backdrop-blur-[20px]
            bg-gradient-to-br from-white/95 via-white/90 to-white/95
            dark:from-[#0B0E10]/80 dark:via-[#0B0E10]/75 dark:to-[#0B0E10]/80
            border border-[#27B4F5]/40
            shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
            transition-all duration-500 ease-out
          ">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#27B4F5] mb-4 sm:mb-6
              drop-shadow-[0_0_20px_#27B4F5,0_0_40px_#27B4F5/50]">
              Join Our Journey
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              We&apos;re constantly evolving and improving based on your feedback. 
              Whether you&apos;re a seasoned writer or just starting out, ZINGG is here 
              to help you share your voice with the world.
            </p>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Start your story today and be part of a community that values authentic 
              expression and meaningful connections.
            </p>
          </div>
        </section>
      </main>

      {/* Floating Dock Footer */}
      <footer className="relative z-10 w-full pb-8 sm:pb-12 md:pb-16 pt-8">
        <div className="flex items-center justify-center">
          <FloatingDock
            items={socialLinks}
            mobileClassName="translate-y-0"
          />
        </div>
      </footer>
    </div>
  );
}

