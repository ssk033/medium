"use client";

import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Dialog } from "./Dialog";
import { CompactFileUpload } from "./ui/compact-file-upload";
import MentionInput from "./MentionInput";

type AddProps = {
  onClose: () => void;
  onBlogAdded: () => void;
};

export default function Add({ onClose, onBlogAdded }: AddProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      setDialog({
        isOpen: true,
        title: "Required Fields",
        message: "Title and Content are required",
        type: "alert",
        onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    if (!session?.user?.id) {
      setDialog({
        isOpen: true,
        title: "Authentication Required",
        message: "You must be logged in to post a blog.",
        type: "alert",
        onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("authorID", session.user.id);
      
      // Append files if any (validate size before upload)
      for (const file of files) {
        const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          setDialog({
            isOpen: true,
            title: "File Too Large",
            message: `File "${file.name}" is too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
            type: "alert",
            onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
          });
          setLoading(false);
          return;
        }
        formData.append("files", file);
      }

      const res = await axios.post("/api/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", res.data);

      if (res.status === 201) {
        onBlogAdded();
        handleClose();
        setTitle("");
        setContent("");
        setFiles([]);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      console.log("❌ POST ERROR:", err?.response?.data || err?.message);
      setDialog({
        isOpen: true,
        title: "Error",
        message: err?.response?.data?.error || "Server error",
        type: "alert",
        onConfirm: () => setDialog((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xl flex justify-center items-center z-50 
      transition-all duration-300 ${isClosing ? "opacity-0 translate-y-5" : "opacity-100"}`}
    >
      <div
        className={`relative w-full max-w-2xl p-8 
        backdrop-blur-[10px]
        bg-gradient-to-br from-white/95 via-white/90 to-white/95
        dark:from-[#0B0E10]/90 dark:via-[#0B0E10]/85 dark:to-[#0B0E10]/90
        border border-[#27B4F5]/50 rounded-2xl
        shadow-[0_0_45px_rgba(39,180,245,0.3),inset_0_1px_0_rgba(0,0,0,0.05)]
        dark:shadow-[0_0_45px_rgba(39,180,245,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
        transition-all duration-300
        ${isClosing ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-[#27B4F5] text-2xl hover:scale-125 hover:text-gray-800 dark:hover:text-white transition"
        >
          ✖
        </button>

        <div className="text-4xl font-black italic text-center mb-8 text-gray-800 dark:text-white 
          drop-shadow-[0_0_25px_rgba(39,180,245,0.6)]
          group-hover:drop-shadow-[0_0_35px_rgba(39,180,245,0.9)]
          transition-all duration-300">
          Add Blog ✍️
        </div>

        <input
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-gray-100 dark:bg-black/20 backdrop-blur-sm border border-[#27B4F5]/40 text-gray-800 dark:text-white rounded-lg mb-6
          focus:border-[#27B4F5] focus:shadow-[0_0_20px_rgba(39,180,245,0.6)] outline-none transition-all duration-300
          placeholder:text-gray-500"
          disabled={loading}
          required
        />

        <MentionInput
          value={content}
          onChange={setContent}
          placeholder="Write your content here... (Type @ to mention users)"
          className="w-full h-40 p-3 bg-gray-100 dark:bg-black/20 backdrop-blur-sm border border-[#27B4F5]/40 text-gray-800 dark:text-white rounded-lg mb-6
          focus:border-[#27B4F5] focus:shadow-[0_0_20px_rgba(39,180,245,0.6)] outline-none transition-all duration-300
          placeholder:text-gray-500 resize-none"
        />

        {/* File Upload Component */}
        <div className="mb-6">
          <CompactFileUpload
            onChange={(uploadedFiles) => setFiles(uploadedFiles)}
            maxFiles={5}
          />
        </div>

        {/* Preview Section - How the post will look */}
        {(title || content || files.length > 0) && (
            <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-black/30 border border-[#27B4F5]/30">
            <h3 className="text-sm font-semibold text-[#27B4F5] mb-3">Preview</h3>
            <div className="space-y-3">
              {title && (
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
              )}
              {content && (
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
              )}
              {files.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {files.map((file, idx) => {
                    const isImage = file.type.startsWith("image/");
                    const previewUrl = isImage ? URL.createObjectURL(file) : null;
                    
                    return (
                      <div key={idx} className="relative rounded-lg overflow-hidden bg-black/50">
                        {isImage && previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt={`Preview ${idx + 1}`}
                            width={800}
                            height={192}
                            className="w-full h-48 object-cover"
                            unoptimized={previewUrl.startsWith('data:') || previewUrl.startsWith('blob:')}
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-[#27B4F5]/20">
                            <span className="text-4xl">🎥</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-3">
            <div className="w-10 h-10 border-4 border-[#27B4F5] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <button
            onClick={handlePost}
            className="w-full py-2.5 text-black font-semibold rounded-lg bg-[#27B4F5]
            hover:shadow-[0_0_25px_rgba(39,180,245,0.8)] hover:scale-[1.02] 
            transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Post
          </button>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onConfirm={dialog.onConfirm}
        confirmText="OK"
      />
    </div>
  );
}
