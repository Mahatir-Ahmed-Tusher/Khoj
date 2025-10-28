"use client";

import { useState, memo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { useVoiceSearch } from "@/lib/hooks/useVoiceSearch";
import { isUrl } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  "data-tour"?: string;
  dynamicPlaceholder?: string;
  isNewsCheckMode?: boolean;
  isAIImageCheckMode?: boolean;
  isImageSearchMode?: boolean;
}

const SearchBar = memo(function SearchBar({
  placeholder = "কী যাচাই করতে চান আজকে?",
  className = "",
  onSearch,
  "data-tour": dataTour,
  dynamicPlaceholder,
  isNewsCheckMode = false,
  isAIImageCheckMode = false,
  isImageSearchMode = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isRecording,
    isListening,
    error,
    startVoiceSearch,
    stopVoiceSearch,
    isSupported,
  } = useVoiceSearch();

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for voice search results
  useEffect(() => {
    const handleVoiceResult = (event: CustomEvent) => {
      const transcript = event.detail.transcript;
      setQuery(transcript);

      // Auto-submit the search
      if (transcript.trim()) {
        if (onSearch) {
          onSearch(transcript.trim());
        } else {
          router.push(
            `/factcheck-detail?query=${encodeURIComponent(transcript.trim())}`
          );
        }
      }
    };

    window.addEventListener(
      "voiceSearchResult",
      handleVoiceResult as EventListener
    );
    return () => {
      window.removeEventListener(
        "voiceSearchResult",
        handleVoiceResult as EventListener
      );
    };
  }, [onSearch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If there's a selected file, redirect to image search page with file data
    if (selectedFile) {
      // Store file in sessionStorage temporarily
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
          content: e.target?.result as string, // Base64 content
        };
        sessionStorage.setItem("selectedImageFile", JSON.stringify(fileData));

        // Redirect to image search page
        if (isAIImageCheckMode) {
          router.push("/image-check");
        } else if (isImageSearchMode) {
          router.push("/image-search");
        } else {
          router.push("/image-search");
        }
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    // News check mode - validate URL and redirect to news verification
    if (isNewsCheckMode && query.trim()) {
      if (isUrl(query.trim())) {
        router.push(
          `/news-verification-v2?url=${encodeURIComponent(query.trim())}`
        );
        return;
      } else {
        alert("দয়া করে একটি বৈধ URL দিন");
        return;
      }
    }

    // Regular text search - but will be handled by page.tsx's handleSearch which now auto-detects URLs
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(
          `/factcheck-detail?query=${encodeURIComponent(query.trim())}`
        );
      }
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Clear selected file when typing
    if (selectedFile) {
      setSelectedFile(null);
    }
  }, [selectedFile]);

  const handleMicClick = async () => {
    if (isRecording) {
      stopVoiceSearch();
    } else {
      await startVoiceSearch();
    }
  };

  const handleImageSearchClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (isAIImageCheckMode) {
        setQuery(`এআই জেনারেটেড কিনা তা জানা হবে ${file.name} এর ব্যাপারে`);
      } else if (isImageSearchMode) {
        setQuery(`${file.name} - অনলাইনে কোথায় আছে তা জানা হবে`);
      } else {
        setQuery(`${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      data-tour={dataTour}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={dynamicPlaceholder || placeholder}
          className="search-input pr-24 md:pr-36 text-sm md:text-base"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="text"
          enterKeyHint="search"
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Attachment Icon */}
        <button
          type="button"
          onClick={handleImageSearchClick}
          className={`absolute right-20 md:right-28 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 transition-all duration-200 ${
            isAIImageCheckMode
              ? "hover:opacity-70 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
          title={
            isAIImageCheckMode
              ? "Upload Image for AI Detection"
              : "AI ছবি যাচাই বাটনে ক্লিক করুন"
          }
          disabled={!isAIImageCheckMode}
        >
          <Image
            src="/attach-file.png"
            alt="Upload Image"
            width={16}
            height={16}
            className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
              isAIImageCheckMode ? "filter-none" : "filter grayscale"
            }`}
          />
        </button>

        {/* Image Search Icon */}
        <button
          type="button"
          onClick={handleImageSearchClick}
          className="absolute right-14 md:right-20 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 transition-opacity duration-200 hover:opacity-70"
          title="Image Search"
        >
          <Image
            src="/image-search.png"
            alt="Image Search"
            width={16}
            height={16}
            className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
              isImageSearchMode
                ? "filter-none"
                : "filter grayscale hover:grayscale-0"
            }`}
          />
        </button>

        {/* Mic Icon */}
        <button
          type="button"
          onClick={handleMicClick}
          className={`absolute right-8 md:right-12 top-1/2 transform -translate-y-1/2 p-1.5 md:p-2 transition-all duration-200 ${
            isRecording ? "animate-pulse" : "hover:opacity-70"
          }`}
          title={isRecording ? "Recording... Click to stop" : "Voice Search"}
          disabled={!isClient || !isSupported}
        >
          {!isClient ? (
            // Server-side fallback - always show the fallback icon
            <Mic className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          ) : isSupported ? (
            <Image
              src="/mic.png"
              alt="Voice Search"
              width={16}
              height={16}
              className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
                isRecording
                  ? "filter-none"
                  : "filter grayscale hover:grayscale-0"
              }`}
            />
          ) : (
            <Mic className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          )}
        </button>

        {/* Search Icon */}
        <button
          type="submit"
          className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white p-1.5 md:p-2 rounded-md transition-colors duration-200"
        >
          <Search className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md text-sm font-tiro-bangla z-10">
          {error}
        </div>
      )}

      {/* Voice Search Status */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-2 rounded-md text-sm font-tiro-bangla z-10">
          🎤 শুনছি... কথা বলুন
        </div>
      )}
    </form>
  );
});

export default SearchBar;
