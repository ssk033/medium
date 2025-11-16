"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MentionInput({
  value,
  onChange,
  placeholder,
  className,
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Search users when @ is typed
  useEffect(() => {
    if (mentionQuery && showSuggestions) {
      const searchUsers = async () => {
        try {
          const res = await axios.get(`/api/user/search?q=${encodeURIComponent(mentionQuery)}&limit=20`);
          setSuggestions(res.data.users || []);
        } catch (error) {
          console.error("Error searching users:", error);
          setSuggestions([]);
        }
      };

      const debounce = setTimeout(searchUsers, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
  }, [mentionQuery, showSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Check if @ was just typed
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      // Check if there's a space after @ (meaning mention is complete)
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      if (!textAfterAt.includes(" ") && !textAfterAt.includes("\n")) {
        // We're in a mention
        const query = textAfterAt;
        setMentionQuery(query);
        setMentionIndex(lastAtIndex);
        setShowSuggestions(true);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    onChange(newValue);
  };

  const insertMention = (user: User) => {
    if (mentionIndex === -1) return;

    const username = user.username || user.name || "user";
    const beforeMention = value.substring(0, mentionIndex);
    const afterMention = value.substring(mentionIndex + 1 + mentionQuery.length);
    const newValue = `${beforeMention}@${username} ${afterMention}`;

    onChange(newValue);
    setShowSuggestions(false);
    setMentionQuery("");
    setMentionIndex(-1);

    // Set cursor after the mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = mentionIndex + username.length + 2; // +2 for @ and space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  // Calculate position for suggestions dropdown
  const getSuggestionsPosition = () => {
    if (!textareaRef.current || mentionIndex === -1) return { top: 0, left: 0 };

    const textarea = textareaRef.current;
    const textBeforeMention = value.substring(0, mentionIndex);
    
    // Create a temporary span to measure text width
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre-wrap";
    span.style.font = window.getComputedStyle(textarea).font;
    span.style.width = textarea.offsetWidth + "px";
    span.textContent = textBeforeMention;
    document.body.appendChild(span);

    const rect = textarea.getBoundingClientRect();
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const lines = textBeforeMention.split("\n").length;
    
    const top = rect.top + (lines * lineHeight) + 25;
    const left = rect.left + span.offsetWidth;

    document.body.removeChild(span);
    return { top, left };
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={getSuggestionsPosition()}
          className="
            fixed z-[1000] mt-1 max-h-60 w-64 overflow-auto
            bg-white/95 dark:bg-[#0B0E10]/95 backdrop-blur-xl
            border border-[#27B4F5]/60 rounded-lg shadow-2xl
            py-2
          "
        >
          {/* Search Bar */}
          <div className="px-3 pb-2 border-b border-[#27B4F5]/30">
            <input
              type="text"
              value={mentionQuery}
              onChange={(e) => {
                setMentionQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search users..."
              className="
                w-full px-2 py-1 text-sm rounded
                bg-gray-100 dark:bg-gray-800
                text-gray-800 dark:text-white
                border border-[#27B4F5]/30 focus:border-[#27B4F5] focus:outline-none
              "
              autoFocus
            />
          </div>

          {/* User List */}
          <div className="py-1">
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => insertMention(user)}
                className={`
                  w-full px-3 py-2 flex items-center gap-2 text-left
                  hover:bg-[#27B4F5]/20 dark:hover:bg-[#27B4F5]/30
                  transition-colors
                  ${index === selectedIndex ? "bg-[#27B4F5]/30 dark:bg-[#27B4F5]/40" : ""}
                `}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#27B4F5]/20 to-[#27B4F5]/10 flex items-center justify-center">
                  {user.image && user.image.trim() ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      unoptimized={user.image.startsWith('data:')}
                    />
                  ) : (
                    <span className="font-semibold text-[#27B4F5] text-xs">
                      {(user.name || user.username || "U").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {user.name || user.username || "User"}
                  </p>
                  {user.username && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

