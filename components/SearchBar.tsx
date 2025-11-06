"use client";

import { useState, memo, useEffect, useRef, useCallback } from "react";
import ImageOptionsModal from "@/components/ImageOptionsModal";
import { useRouter } from "next/navigation";
import { Search, Mic, MicOff, X, ImageUpIcon, XCircle } from "lucide-react";
import Image from "next/image";
import { useLoading } from "./LoadingProvider";
import { useVoiceSearch } from "@/lib/hooks/useVoiceSearch";
import { isUrl } from "@/lib/utils";
import { createPortal } from "react-dom";

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
  const loadingCtx = useLoading();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const {
    isRecording,
    isListening,
    error,
    startVoiceSearch,
    stopVoiceSearch,
    isSupported,
  } = useVoiceSearch();

  // SOLUTION: Helper function to reset file input
  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Auto-resize textarea function
  const autoResize = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Maximum height in pixels (about 3 lines)
      const minHeight = 56; // Minimum height in pixels

      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = "auto";
      } else if (scrollHeight < minHeight) {
        textareaRef.current.style.height = `${minHeight}px`;
        textareaRef.current.style.overflowY = "hidden";
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = "hidden";
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
      "যেকোনো গুজব, অপবিজ্ঞান নিয়ে প্রশ্ন করুন",
      "কোনো লেখা চুরি হয়েছে কিনা তা জানতে এখানে লিখুন",
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

      textarea.addEventListener("paste", handlePaste);
      return () => textarea.removeEventListener("paste", handlePaste);
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

  const handleTextOptionSelect = (option: "factcheck" | "plagiarism") => {
    const text = query.trim();
    if (!text) return;
    if (option === "plagiarism") {
      // Per requirement: "আপনি কি এটির ফ্যাক্টচেক করতে চান?" -> /plag-test
      sessionStorage.setItem("plagiarismText", text);
      router.push("/plag-test");
    } else {
      // "এই লেখাটি চুরি করা হয়েছে কিনা তা জানতে চান?" -> AI fact-checker page
      router.push(`/factcheck-detail?query=${encodeURIComponent(text)}`);
    }
  };

  const handleImageOptionSelect = async (option: string, croppedImageUrl?: string, userMessage?: string) => {
    if (!selectedFile) return;

    // For Photocard news verification
    if (option === "Photocard news verification") {
      console.log("[SearchBar] Starting Photocard news verification");

      // ensure loading is on (ImageOptionsModal already sets it, but ensure here too)
      try {
        loadingCtx.setLoading(true);
      } catch (e) {}

      const formData = new FormData();
      
      // Use cropped image if available, otherwise use original file
      if (croppedImageUrl) {
        // Convert cropped image URL to File
        try {
          const response = await fetch(croppedImageUrl);
          const blob = await response.blob();
          const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type || "image/jpeg" });
          formData.append("image", croppedFile);
          console.log("[SearchBar] Using cropped image for text extraction");
        } catch (error) {
          console.error("[SearchBar] Error converting cropped image to file:", error);
          // Fallback to original file
          formData.append("image", selectedFile);
        }
      } else {
        formData.append("image", selectedFile);
      }

      try {
        // First, extract text from the image
        console.log("[SearchBar] Sending image for text extraction");
        const extractResponse = await fetch("/api/image-to-text", {
          method: "POST",
          body: formData,
        });

        if (!extractResponse.ok) {
          const body = await extractResponse.text();
          console.error("[SearchBar] Text extraction failed:", body);
          try {
            loadingCtx.setLoading(false);
          } catch (e) {}
          alert("Failed to extract text from image");
          resetFileInput(); // SOLUTION: Reset on error
          return;
        }

        const { text } = await extractResponse.json();
        console.log("[SearchBar] Extracted text:", text);

        if (!text) {
          console.warn("[SearchBar] No text extracted from image");
          try {
            loadingCtx.setLoading(false);
          } catch (e) {}
          alert("No text could be extracted from the image");
          resetFileInput(); // SOLUTION: Reset on error
          return;
        }

        // Step 2: Parse the extracted text using GPT-OSS-120B for optimized fact-checking
        console.log("[SearchBar] Parsing extracted text using GPT-OSS-120B...");
        let optimizedClaim = text; // Default to original text
        
        try {
          const parseResponse = await fetch("/api/parse-query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              text: text,
              source: "photocard-verification",
              userMessage: userMessage?.trim() || undefined // Pass user message if provided
            }),
          });

          if (parseResponse.ok) {
            const parseData = await parseResponse.json();
            if (parseData.claim && parseData.claim.length > 10) {
              optimizedClaim = parseData.claim;
              console.log("[SearchBar] ✅ Optimized claim:", optimizedClaim);
            } else {
              console.warn("[SearchBar] ⚠️ Parsed claim validation failed, using original text");
            }
          } else {
            console.warn("[SearchBar] ⚠️ Query parsing failed, using original extracted text");
          }
        } catch (parseError) {
          console.error("[SearchBar] ❌ Query parsing error:", parseError);
          // Continue with original text if parsing fails
        }

        // Now send the optimized claim to fact-checking page
        console.log(
          "[SearchBar] Sending optimized claim to fact-checking page"
        );
        // SOLUTION: Reset before navigation
        resetFileInput();
        // Keep the global loading dialog visible; the target page will clear it when done.
        window.location.href = `/factcheck-detail?query=${encodeURIComponent(optimizedClaim)}`;
        return;
      } catch (error) {
        console.error("[SearchBar] Error processing image:", error);
        try {
          loadingCtx.setLoading(false);
        } catch (e: any) {
          console.log(e.message);
        }
        alert("Error processing image");
        resetFileInput(); // SOLUTION: Reset on error
        return;
      }
    }

    // For other options, maintain existing behavior
    // Use cropped image if available, otherwise use original file
    const fileToUse = croppedImageUrl 
      ? (async () => {
          try {
            const response = await fetch(croppedImageUrl);
            const blob = await response.blob();
            return new File([blob], selectedFile.name, { type: selectedFile.type || "image/jpeg" });
          } catch (error) {
            console.error("[SearchBar] Error converting cropped image to file:", error);
            return selectedFile;
          }
        })()
      : Promise.resolve(selectedFile);

    fileToUse.then((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          content: e.target?.result as string, // Base64 content
        };
        sessionStorage.setItem("selectedImageFile", JSON.stringify(fileData));

        // SOLUTION: Reset before navigation
        resetFileInput();

        // Redirect based on selection
        if (option === "AI image detection") {
          router.push("/image-check");
        } else if (option === "Image search") {
          router.push("/image-search");
        } else {
          router.push("/image-search");
        }
      };
      reader.readAsDataURL(file);
    }).catch((error) => {
      console.error("[SearchBar] Error processing file:", error);
      // Fallback to original file
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          lastModified: selectedFile.lastModified,
          content: e.target?.result as string,
        };
        sessionStorage.setItem("selectedImageFile", JSON.stringify(fileData));
        resetFileInput();
        if (option === "AI image detection") {
          router.push("/image-check");
        } else if (option === "Image search") {
          router.push("/image-search");
        } else {
          router.push("/image-search");
        }
      };
      reader.readAsDataURL(selectedFile);
    });
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setQuery(value);
      // Clear selected file when typing
      if (selectedFile) {
        setSelectedFile(null);
        resetFileInput(); // SOLUTION: Reset when clearing file
      }
      // Auto-resize after state update
      setTimeout(autoResize, 0);
    },
    [selectedFile, autoResize, resetFileInput]
  );

  const handleMicClick = async () => {
    if (isRecording) {
      stopVoiceSearch();
    } else {
      await startVoiceSearch();
    }
  };

  const handleImageSearchClick = () => {
    console.log("Attachment/Image Search button clicked!");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Only allow image files
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        resetFileInput(); // SOLUTION: Reset on error
        return;
      }

      setSelectedFile(file);
      setQuery(`${file.name} - ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // This will trigger the preview modal
    }
  };

  // SOLUTION: Modal close handler with file input reset
  const handleModalClose = useCallback(() => {
    setShowImageModal(false);
    resetFileInput(); // SOLUTION: Reset when modal closes
  }, [resetFileInput]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
            placeholder={
              dynamicPlaceholder ||
              [
                "আজকে কী ব্যাপারে যাচাই-বাচাই করতে চান?",
                "কোনো খবর যাচাই করতে লিংক দিন এখানে",
                "কোনো ছবি এআই জেনারেটেড কীনা জানতে আপলোড করুন",
                "কোনো ছবির উৎস জানতে আপলোড করুন",
                "যেকোনো গুজব, অপবিজ্ঞান নিয়ে প্রশ্ন করুন",
                "কোনো লেখা চুরি হয়েছে কিনা তা জানতে এখানে লিখুন",
              ][placeholderIndex] ||
              placeholder
            }
            className="search-input pr-24 md:pr-36 text-sm md:text-base resize-none overflow-hidden"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            rows={1}
            style={{
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
              WebkitTouchCallout: "none",
              WebkitUserSelect: "text",
              fontSize: "16px",
              minHeight: "56px",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              backfaceVisibility: "hidden",
              perspective: "1000px",
              willChange: "auto",
              transform: "translateZ(0)",
              transition: "height 0.2s ease-in-out",
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
            <ImageUpIcon width={20} height={20} color="black" />
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

      {/* ImageOptionsModal for image upload actions */}
      <ImageOptionsModal
        isOpen={showImageModal && !!previewUrl}
        onClose={handleModalClose} // SOLUTION: Use handler with reset
        onSelectOption={handleImageOptionSelect}
        previewUrl={previewUrl}
      />

      {/* Long Text Modal */}
      {showTextModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          onClick={() => setShowTextModal(false)}
        >
          <div
            className="relative flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              onClick={() => setShowTextModal(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleTextOptionSelect("plagiarism")}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              আপনি কি এটির ফ্যাক্টচেক করতে চান?
            </button>
            <button
              onClick={() => handleTextOptionSelect("factcheck")}
              className="px-8 py-4 bg-white text-gray-800 rounded-xl border-2 border-gray-300 hover:border-orange-500 transition-all duration-200 font-tiro-bangla text-lg font-medium"
            >
              এই লেখাটি চুরি করা হয়েছে কিনা তা জানতে চান?
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default SearchBar;
