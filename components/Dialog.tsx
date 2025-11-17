"use client";

import { useEffect } from "react";

type DialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type?: "alert" | "confirm";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const Dialog = ({
  isOpen,
  title,
  message,
  type = "alert",
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: DialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-xl flex justify-center items-center z-[9999] 
      transition-all duration-300 animate-fadeIn"
      onClick={type === "confirm" ? onCancel : () => onConfirm?.()}
    >
      <div
        className="relative w-full max-w-[calc(100%-2rem)] sm:max-w-md mx-4 p-4 sm:p-6 rounded-2xl z-10
        backdrop-blur-[20px]
        bg-gradient-to-br from-[#0B0E10]/95 via-[#0B0E10]/90 to-[#0B0E10]/95
        border border-[#27B4F5]/50
        shadow-[0_0_40px_rgba(39,180,245,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(39,180,245,0.9)]
        animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#27B4F5] mb-3 sm:mb-4
          drop-shadow-[0_0_10px_#27B4F5/50]">
          {title}
        </h2>

        {/* Message */}
        <p className="text-gray-200 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg 
              border border-[#27B4F5]/50 text-gray-300 
              hover:bg-[#27B4F5]/20 hover:border-[#27B4F5] 
              hover:text-white transition-all duration-300
              hover:scale-105 active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold
            transition-all duration-300 hover:scale-105 active:scale-95
            ${
              type === "confirm"
                ? "bg-[#27B4F5] text-black hover:shadow-[0_0_20px_rgba(39,180,245,0.8)]"
                : "bg-[#27B4F5] text-black hover:shadow-[0_0_20px_rgba(39,180,245,0.8)]"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

