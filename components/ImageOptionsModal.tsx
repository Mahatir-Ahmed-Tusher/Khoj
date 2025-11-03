"use client";

import React from "react";
import { useLoading } from "./LoadingProvider";
import { createPortal } from "react-dom";
import { XCircle } from "lucide-react";
import Image from "next/image";

interface ImageOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
  previewUrl?: string;
}

const ImageOptionsModal: React.FC<ImageOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectOption,
  previewUrl,
}) => {
  if (!isOpen) return null;

  // useLoading provides a safe fallback when provider is missing, so we can call it directly
  const loadingCtx = useLoading();

  const options = [
    {
      label: "ছবির উৎস সন্ধান",
      name: "Image search",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      label: "এআই ছবি যাচাই",
      name: "AI image detection",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
    },
    {
      label: "ফটোকার্ড থেকে খবর যাচাই",
      name: "Photocard news verification",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
  ];
  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-auto bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            একটি অপশন বাছাই করুন{" "}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Preview */}
          {previewUrl && (
            <div className="mb-6">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl}
                  alt="Selected image preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          )}

          {/* Options - Horizontal Layout */}
          <div className="flex flex-wrap gap-3">
            {options.map((option) => (
              <button
                key={option.name}
                onClick={() => {
                  // trigger global loading and then call handlers
                  try {
                    loadingCtx?.setLoading(true);
                    // console log for visibility
                    // eslint-disable-next-line no-console
                    console.log(
                      `[ImageOptionsModal] option clicked: ${option.name}`
                    );
                  } catch (e) {
                    // noop
                  }
                  onSelectOption(option.name);
                  onClose();
                }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-white transition-all duration-200 transform hover:scale-105 active:scale-95 ${option.color} ${option.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render via portal so modal reliably appears above all layout content
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }

  return null;
};

export default ImageOptionsModal;
