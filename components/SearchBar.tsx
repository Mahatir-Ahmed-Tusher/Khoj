"use client";

import { useState, memo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff, X } from "lucide-react";
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
}

const SearchBar = memo(function SearchBar({
  placeholder = "কী যাচাই করতে চান আজকে?",
  className = "",
  onSearch,
  "data-tour": dataTour,
  dynamicPlaceholder,
  isNewsCheckMode = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isRecording,
    isListening,
    error,
    startVoiceSearch,
    stopVoiceSearch,
    isSupported,
  } = useVoiceSearch();

  // Auto-resize textarea function
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Maximum height in pixels (about 3 lines)
      const minHeight = 56; // Minimum height in pixels
      
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else if (scrollHeight < minHeight) {
        textareaRef.current.style.height = `${minHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, []);

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rotating placeholder every 3 seconds (only when dynamicPlaceholder is not provided)
  useEffect(() => {
    if (dynamicPlaceholder) return; // respect externally provided placeholder
    const placeholders = [
      "আজকে কী ব্যাপারে যাচাই-বাচাই করতে চান?",
      "কোনো খবর যাচাই করতে লিংক দিন এখানে",
      "কোনো ছবি এআই জেনারেটেড কীনা জানতে আপলোড করুন",
      "কোনো ছবির উৎস জানতে আপলোড করুন",
      "যেকোনো গুজব, অপবিজ্ঞান নিয়ে প্রশ্ন করুন",
    ];
    const intervalId = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, [dynamicPlaceholder]);

  // Auto-resize on mount and when query changes
  useEffect(() => {
    autoResize();
  }, [query, autoResize]);

  // Handle paste events for auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handlePaste = () => {
        setTimeout(autoResize, 10);
      };
      
      textarea.addEventListener('paste', handlePaste);
      return () => textarea.removeEventListener('paste', handlePaste);
    }
  }, [autoResize]);

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

    // If there's a selected file, show modal to choose between AI check or image search
    if (selectedFile) {
      setShowImageModal(true);
      return;
    }

    // Long-text detection: if >=280 alphabetic chars (Bangla/English), show modal
    if (query.trim()) {
      const letters = (query.match(/[A-Za-z\u0980-\u09FF]/g) || []).length;
      if (letters >= 280) {
        setShowTextModal(true);
        return;
      }
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

  const handleTextOptionSelect = (option: 'factcheck' | 'plagiarism') => {
    const text = query.trim();
    if (!text) return;
    if (option === 'plagiarism') {
      // Per requirement: "আপনি কি এটির ফ্যাক্টচেক করতে চান?" -> /plag-test
      sessionStorage.setItem('plagiarismText', text);
      router.push('/plag-test');
    } else {
      // "এই লেখাটি চুরি করা হয়েছে কিনা তা জানতে চান?" -> AI fact-checker page
      router.push(`/factcheck-detail?query=${encodeURIComponent(text)}`);
    }
  };

  const handleImageOptionSelect = (option: 'ai-check' | 'image-search') => {
    if (!selectedFile) return;

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

      // Redirect based on selection
      if (option === 'ai-check') {
        router.push("/image-check");
      } else {
        router.push("/image-search");
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Clear selected file when typing
    if (selectedFile) {
      setSelectedFile(null);
    }
    // Auto-resize after state update
    setTimeout(autoResize, 0);
  }, [selectedFile, autoResize]);

  const handleMicClick = async () => {
    if (isRecording) {
      stopVoiceSearch();
    } else {
      await startVoiceSearch();
    }
  };

  const handleImageSearchClick = () => {
    console.log('Attachment/Image Search button clicked!');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setQuery(`${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`relative ${className}`}
        data-tour={dataTour}
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInputChange}
            placeholder={dynamicPlaceholder || [
              "আজকে কী ব্যাপারে যাচাই-বাচাই করতে চান?",
              "কোনো খবর যাচাই করতে লিংক দিন এখানে",
              "কোনো ছবি এআই জেনারেটেড কীনা জানতে আপলোড করুন",
              "কোনো ছবির উৎস জানতে আপলোড করুন",
              "যেকোনো গুজব, অপবিজ্ঞান নিয়ে প্রশ্ন করুন",
            ][placeholderIndex] || placeholder}
            className="search-input pr-24 md:pr-36 text-sm md:text-base resize-none overflow-hidden"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            rows={1}
            style={{
              WebkitAppearance: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'text',
              fontSize: '16px',
              minHeight: '56px',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
              willChange: 'auto',
              transform: 'translateZ(0)',
              transition: 'height 0.2s ease-in-out'
            }}
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
            className="absolute right-14 md:right-20 top-3 p-1.5 md:p-2 transition-opacity duration-200 hover:opacity-70 cursor-pointer z-10"
            title="Upload Image"
            style={{ zIndex: 10 }}
          >
            <Image
              src="/attach-file.png"
              alt="Upload Image"
              width={16}
              height={16}
              className="w-4 h-4 md:w-5 md:h-5 transition-all duration-200"
            />
          </button>

          {/* Mic Icon */}
          <button
            type="button"
            onClick={handleMicClick}
            className={`absolute right-8 md:right-12 top-3 p-1.5 md:p-2 transition-all duration-200 ${
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
            className="absolute right-1 md:right-2 top-3 bg-primary-600 hover:bg-primary-700 text-white p-1.5 md:p-2 rounded-md transition-colors duration-200"
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

      {/* Image Upload Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            {/* AI ছবি যাচাই Button */}
            <button
              onClick={() => handleImageOptionSelect('ai-check')}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              AI ছবি যাচাই
            </button>

            {/* ছবি সার্চ Button */}
            <button
              onClick={() => handleImageOptionSelect('image-search')}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-orange-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              ছবি সার্চ
            </button>
          </div>
        </div>
      )}

      {/* Long Text Modal */}
      {showTextModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={() => setShowTextModal(false)}
        >
          <div className="relative flex flex-col space-y-4" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Close"
              onClick={() => setShowTextModal(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleTextOptionSelect('plagiarism')}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              আপনি কি এটির ফ্যাক্টচেক করতে চান?
            </button>
            <button
              onClick={() => handleTextOptionSelect('factcheck')}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-orange-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              এই লেখাটি চুরি করা হয়েছে কিনা তা জানতে চান?
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default SearchBar;
