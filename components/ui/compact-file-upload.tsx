"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

interface CompactFileUploadProps {
  onChange?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  maxFiles?: number;
}

export const CompactFileUpload = ({
  onChange,
  onRemove,
  maxFiles = 1,
}: CompactFileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    // Filter to only accept images and videos
    const validFiles = newFiles.filter((file) => {
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    });

    if (validFiles.length === 0 && newFiles.length > 0) {
      console.log("Only image and video files are allowed");
      return;
    }

    const filesToAdd = validFiles.slice(0, maxFiles - files.length);
    if (filesToAdd.length > 0) {
      const updatedFiles = [...files, ...filesToAdd];
      setFiles(updatedFiles);
      if (onChange) {
        onChange(updatedFiles);
      }
    }
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleClick = () => {
    if (files.length < maxFiles) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: maxFiles > 1,
    noClick: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".ogg", ".mov"],
    },
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div className="flex flex-col gap-2">
        {/* Upload Button */}
        {files.length < maxFiles && (
          <motion.button
            type="button"
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300",
              "bg-black/20 backdrop-blur-sm border-[#27B4F5]/50 text-[#27B4F5]",
              "hover:bg-[#27B4F5] hover:text-black hover:border-[#27B4F5]",
              "hover:shadow-[0_0_15px_rgba(39,180,245,0.6)]",
              isDragActive && "bg-[#27B4F5] text-black border-[#27B4F5]"
            )}
          >
            <IconUpload className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isDragActive ? "Drop Image/Video" : "Upload Image/Video"}
            </span>
          </motion.button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple={maxFiles > 1}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        {/* File Preview List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {files.map((file, idx) => (
              <motion.div
                key={`file-${idx}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg",
                  "bg-black/30 backdrop-blur-sm border border-[#27B4F5]/30"
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-[#27B4F5]/20 flex items-center justify-center">
                    {file.type.startsWith("image/") ? (
                      <span className="text-xs">🖼️</span>
                    ) : (
                      <span className="text-xs">🎥</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className={cn(
                    "ml-2 p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400",
                    "transition-colors"
                  )}
                >
                  <IconX className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

