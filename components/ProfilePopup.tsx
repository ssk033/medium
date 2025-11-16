"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProfilePopupProps {
  userId?: string;
  userName: string;
  userImage: string | null;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function ProfilePopup({
  userName,
  userImage,
  isOpen,
  onClose,
  position,
}: ProfilePopupProps) {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);
  const [viewImageModal, setViewImageModal] = useState(false);

  // Close popup when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleViewProfile = () => {
    router.push(`/profile?username=${userName}`);
    onClose();
  };

  const handleViewPhoto = () => {
    if (userImage && userImage.trim()) {
      setViewImageModal(true);
    }
  };

  // Calculate popup position (prevent going off screen)
  const popupStyle = {
    position: "fixed" as const,
    left: `${Math.min(position.x, window.innerWidth - 200)}px`,
    top: `${Math.min(position.y + 20, window.innerHeight - 150)}px`,
    zIndex: 1000,
  };

  return (
    <>
      <div
        ref={popupRef}
        style={popupStyle}
        className="
          bg-white/95 dark:bg-[#0B0E10]/95 backdrop-blur-xl
          border border-[#27B4F5]/60 rounded-lg shadow-2xl
          p-3 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200
        "
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={handleViewPhoto}
            disabled={!userImage || !userImage.trim()}
            className="
              px-4 py-2 text-left text-sm font-medium
              text-gray-800 dark:text-white
              hover:bg-[#27B4F5]/20 dark:hover:bg-[#27B4F5]/30
              rounded-md transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            📷 View Profile Photo
          </button>
          <button
            onClick={handleViewProfile}
            className="
              px-4 py-2 text-left text-sm font-medium
              text-gray-800 dark:text-white
              hover:bg-[#27B4F5]/20 dark:hover:bg-[#27B4F5]/30
              rounded-md transition-colors
            "
          >
            👤 View Profile
          </button>
        </div>
      </div>

      {/* View Profile Picture Modal */}
      {viewImageModal && userImage && userImage.trim() && (
        <div
          className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex justify-center items-center z-[100]"
          onClick={() => {
            setViewImageModal(false);
            onClose();
          }}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setViewImageModal(false);
                onClose();
              }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg z-10"
            >
              ✖
            </button>
            <Image
              src={userImage}
              alt={`${userName}'s profile picture`}
              width={800}
              height={800}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              unoptimized={userImage.startsWith('data:')}
            />
          </div>
        </div>
      )}
    </>
  );
}

