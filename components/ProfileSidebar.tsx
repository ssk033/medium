"use client";

import { useState, useEffect, useRef } from "react";

interface SidebarProps {
  name: string;
  username: string;
  totalBlogs: number;
  onToggle?: (isOpen: boolean) => void;
}

export default function ProfileSidebar({ name, username, totalBlogs, onToggle }: SidebarProps) {
  // Initialize mobile state based on window width if available
  const [open, setOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // Open by default on desktop
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [navbarHeight, setNavbarHeight] = useState(67); // Default navbar height
  const prevMobileRef = useRef(isMobile);

  // Calculate navbar height and handle responsive behavior
  useEffect(() => {
    const calculateNavbarHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const height = nav.offsetHeight;
        setNavbarHeight(height);
        // Set CSS variable for use in other components
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      } else {
        // Fallback to default if nav not found
        setNavbarHeight(67);
        document.documentElement.style.setProperty('--navbar-height', '67px');
      }
    };

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      const wasMobile = prevMobileRef.current;
      prevMobileRef.current = mobile;
      setIsMobile(mobile);
      // Close sidebar when switching to mobile, open when switching to desktop
      if (mobile && !wasMobile) {
        setOpen(false);
      } else if (!mobile && wasMobile) {
        setOpen(true);
      }
    };

    // Initial calculations with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      calculateNavbarHeight();
      checkMobile();
    }, 100);

    // Listen for resize events
    const handleResize = () => {
      calculateNavbarHeight();
      checkMobile();
    };
    window.addEventListener('resize', handleResize);

    // Recalculate on DOM changes
    const observer = new MutationObserver(() => {
      calculateNavbarHeight();
    });
    const nav = document.querySelector('nav');
    if (nav) {
      observer.observe(nav, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  // Notify parent of sidebar state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(open && !isMobile);
    }
  }, [open, isMobile, onToggle]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[44] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button - Below navbar */}
      <button
        onClick={toggleSidebar}
        className="
          fixed z-[49]
          p-2.5 rounded-full font-bold
          text-[#27B4F5]
          backdrop-blur-xl bg-[#0B0E10]/70
          border border-[#27B4F5]/60
          hover:bg-[#27B4F5] hover:text-black
          shadow-[0_0_25px_rgba(39,180,245,0.7)]
          hover:shadow-[0_0_40px_rgba(39,180,245,1)]
          transition-all duration-300
          left-4
        "
        style={{
          top: isMobile ? '1rem' : `${navbarHeight + 12}px`,
        }}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? "←" : "→"}
      </button>

      {/* Sidebar Panel - Below navbar but above content */}
      <div
        className={`
          fixed left-0 z-[45]
          overflow-y-auto
          transition-all duration-500 ease-out
          ${isMobile 
            ? `h-full w-72 ${open ? "translate-x-0" : "-translate-x-full"}` 
            : `w-64 ${open ? "translate-x-0" : "-translate-x-72"}`
          }
        `}
        style={{
          top: isMobile ? '0' : `${navbarHeight}px`,
          height: isMobile ? '100vh' : `calc(100vh - ${navbarHeight}px)`,
          marginTop: isMobile ? '0' : '0',
        }}
      >
        {/* Glassmorphic Background */}
        <div
          className="
            absolute inset-0
            backdrop-blur-2xl bg-[#0B0E10]/70
            border-r border-[#27B4F5]/40
            shadow-[0_0_50px_rgba(39,180,245,0.6)]
            lg:rounded-r-2xl
          "
        />

        {/* Sidebar Content */}
        <div className="relative z-10 p-6 lg:p-8 text-white flex flex-col justify-between h-full custom-scrollbar">
          <div className="flex flex-col gap-6 lg:gap-8">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#27B4F5] drop-shadow-[0_0_12px_#27B4F5]">
              Profile
            </h2>

            {/* Name */}
            <div>
              <p className="text-gray-400 text-xs lg:text-sm">NAME</p>
              <p className="text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition break-words">
                {name}
              </p>
            </div>

            {/* Username */}
            <div>
              <p className="text-gray-400 text-xs lg:text-sm">USERNAME</p>
              <p className="text-lg lg:text-xl font-semibold break-words opacity-90 hover:text-[#27B4F5] transition">
                @{username}
              </p>
            </div>

            {/* Total Blogs */}
            <div>
              <p className="text-gray-400 text-xs lg:text-sm">TOTAL BLOGS</p>
              <p className="text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition">
                {totalBlogs}
              </p>
            </div>
          </div>

          {/* View Blogs Button */}
          <button
            onClick={() => (window.location.href = "/blogs")}
            className="
              w-full py-3 mt-6 rounded-lg font-semibold
              text-black bg-[#27B4F5]
              hover:shadow-[0_0_30px_rgba(39,180,245,0.9)]
              hover:scale-[1.03] transition-all
              text-sm lg:text-base
            "
          >
            View Blogs
          </button>
        </div>
      </div>
    </>
  );
}
