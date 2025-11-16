"use client";

import { useState, useEffect, useRef } from "react";
import FollowersFollowingModal from "./FollowersFollowingModal";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";

interface SidebarProps {
  name: string;
  username: string;
  totalBlogs: number;
  userId: string;
  followersCount: number;
  followingCount: number;
  profileImage?: string | null;
  onToggle?: (isOpen: boolean) => void;
  onImageUpdate?: (imageUrl: string) => void;
}

export default function ProfileSidebar({
  name,
  username,
  totalBlogs,
  userId,
  followersCount,
  followingCount,
  profileImage,
  onToggle,
  onImageUpdate,
}: SidebarProps) {
  const { data: session } = useSession();
  const isOwnProfile = session?.user?.id === userId;
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [image, setImage] = useState<string | null>(profileImage || null);
  const [uploading, setUploading] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Update image when profileImage prop changes
  useEffect(() => {
    setImage(profileImage || null);
  }, [profileImage]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/api/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.image) {
        setImage(res.data.image);
        if (onImageUpdate) {
          onImageUpdate(res.data.image);
        }
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!image) return;
    
    if (!confirm("Are you sure you want to remove your profile picture?")) {
      return;
    }

    setRemoving(true);
    try {
      const res = await axios.delete("/api/user/avatar");
      
      if (res.data.image === null) {
        setImage(null);
        if (onImageUpdate) {
          onImageUpdate("");
        }
      }
    } catch (error) {
      console.error("Failed to remove image:", error);
      alert("Failed to remove profile picture. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[44] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Toggle Button - Positioned to not overlap content */}
      <button
        onClick={toggleSidebar}
        className="
          fixed z-[49]
          p-2.5 rounded-full font-bold
          text-[#27B4F5]
          backdrop-blur-xl bg-white/90 dark:bg-[#0B0E10]/70
          border border-[#27B4F5]/60
          hover:bg-[#27B4F5] hover:text-black
          shadow-[0_0_25px_rgba(39,180,245,0.4)] dark:shadow-[0_0_25px_rgba(39,180,245,0.7)]
          hover:shadow-[0_0_40px_rgba(39,180,245,0.6)] dark:hover:shadow-[0_0_40px_rgba(39,180,245,1)]
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
        }}
      >
        {/* Glassmorphic Background */}
        <div
          className="
            absolute inset-0
            backdrop-blur-2xl bg-white/90 dark:bg-[#0B0E10]/70
            border-r border-[#27B4F5]/40
            shadow-[0_0_50px_rgba(39,180,245,0.3)] dark:shadow-[0_0_50px_rgba(39,180,245,0.6)]
            lg:rounded-r-2xl
          "
        />

        {/* Sidebar Content */}
        <div className="relative z-10 p-6 lg:p-8 text-gray-800 dark:text-white flex flex-col justify-between h-full custom-scrollbar">
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <button
                  onClick={() => image && setViewImageModal(true)}
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#27B4F5] shadow-[0_0_25px_rgba(39,180,245,0.6)] hover:shadow-[0_0_35px_rgba(39,180,245,0.9)] transition-all cursor-pointer"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized={image.startsWith('data:')}
                    />
                  ) : (
                    <Image
                      src="/icons/blankuser.svg"
                      alt="Default avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
                {isOwnProfile && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-7 h-7 rounded-full bg-[#27B4F5] text-black flex items-center justify-center hover:bg-[#00eeff] transition-all shadow-lg hover:scale-110 disabled:opacity-50 text-xs"
                      title="Change profile picture"
                    >
                      {uploading ? (
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>📷</span>
                      )}
                    </button>
                    {image && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={removing}
                        className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:scale-110 disabled:opacity-50 text-xs"
                        title="Remove profile picture"
                      >
                        {removing ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>🗑️</span>
                        )}
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#27B4F5] drop-shadow-[0_0_12px_#27B4F5] text-center">
              Profile
            </h2>

            {/* Name */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">NAME</p>
              <p className="text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition break-words">
                {name}
              </p>
            </div>

            {/* Username */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">USERNAME</p>
              <p className="text-lg lg:text-xl font-semibold break-words opacity-90 hover:text-[#27B4F5] transition">
                @{username}
              </p>
            </div>

            {/* Total Blogs */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">TOTAL BLOGS</p>
              <p className="text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition">
                {totalBlogs}
              </p>
            </div>

            {/* Followers - Clickable */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">FOLLOWERS</p>
              <button
                onClick={() => setFollowersModalOpen(true)}
                className="
                  text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition
                  cursor-pointer hover:underline
                "
              >
                {followersCount}
              </button>
            </div>

            {/* Following - Clickable */}
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">FOLLOWING</p>
              <button
                onClick={() => setFollowingModalOpen(true)}
                className="
                  text-lg lg:text-xl font-semibold hover:text-[#27B4F5] transition
                  cursor-pointer hover:underline
                "
              >
                {followingCount}
              </button>
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

      {/* Followers Modal */}
      <FollowersFollowingModal
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        userId={userId}
        type="followers"
        title="Followers"
      />

      {/* Following Modal */}
      <FollowersFollowingModal
        isOpen={followingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
        userId={userId}
        type="following"
        title="Following"
      />

      {/* View Profile Picture Modal */}
      {viewImageModal && image && (
        <div
          className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex justify-center items-center z-[100]"
          onClick={() => setViewImageModal(false)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewImageModal(false)}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg z-10"
            >
              ✖
            </button>
            <Image
              src={image}
              alt={`${name}'s profile picture`}
              width={800}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              unoptimized={image.startsWith('data:')}
            />
          </div>
        </div>
      )}
    </>
  );
}
