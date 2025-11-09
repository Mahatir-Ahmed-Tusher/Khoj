"use client";

import React, { useState, useCallback } from "react";
// LoadingProvider removed — do not import useLoading
import { createPortal } from "react-dom";
import { XCircle, Crop, Check, X } from "lucide-react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import Loading from "./Loading";

interface ImageOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (
    option: string,
    croppedImage?: string,
    userMessage?: string
  ) => void;
  previewUrl?: string;
}

const ImageOptionsModal: React.FC<ImageOptionsModalProps> = ({
  isOpen,
  onClose,
  onSelectOption,
  previewUrl,
}) => {
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Loading provider removed; no global loading context here

  // Create image from blob and crop
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  // Get cropped image as data URL
  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!previewUrl || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels);
      setCroppedImageUrl(croppedImage);
      setShowCrop(false);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("ছবি ক্রপ করতে সমস্যা হয়েছে");
    }
  };

  const handleCancelCrop = () => {
    setShowCrop(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    // Don't reset croppedImageUrl if user cancels - keep previous crop if exists
  };

  const handleStartCrop = () => {
    setShowCrop(true);
    setCroppedImageUrl(null);
  };

  if (!isOpen) return null;

  const displayImageUrl = croppedImageUrl || previewUrl;

  const options = [
    {
      label: "ছবির সার্চ",
      name: "Image search",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      label: "AI ছবি যাচাই",
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
          {/* Image Preview or Crop Area */}
          {previewUrl && (
            <div className="mb-6">
              {showCrop ? (
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-900">
                  <Cropper
                    image={previewUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={undefined}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="rect"
                    showGrid={true}
                    restrictPosition={false}
                    minZoom={0.5}
                    maxZoom={5}
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      },
                      cropAreaStyle: {
                        width: "100%",
                        height: "100%",
                      },
                    }}
                  />
                  {/* Zoom Control */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg w-64">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        জুম:
                      </span>
                      <input
                        type="range"
                        min={0.5}
                        max={5}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-xs text-gray-600 font-medium whitespace-nowrap min-w-[3rem]">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                    <button
                      onClick={handleCancelCrop}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">বাতিল</span>
                    </button>
                    <button
                      onClick={handleCrop}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">ক্রপ করুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={displayImageUrl || previewUrl}
                      alt="Selected image preview"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {!croppedImageUrl && (
                    <button
                      onClick={handleStartCrop}
                      className="absolute top-2 right-2 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors text-gray-700"
                    >
                      <Crop className="w-4 h-4" />
                      <span className="text-sm font-medium">ক্রপ করুন</span>
                    </button>
                  )}
                  {croppedImageUrl && (
                    <button
                      onClick={handleStartCrop}
                      className="absolute top-2 right-2 flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Crop className="w-4 h-4" />
                      <span>আবার ক্রপ করুন</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Optional User Message Input (only for Photocard news verification) */}
          {!showCrop && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-tiro-bangla">
                ফটোকার্ড সম্পর্কে আপনার প্রশ্ন বা মন্তব্য
              </label>
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="এই ছবি যাচাই করতে বাড়তি কিছু কি বলতে চান? (অপশনাল)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-tiro-bangla resize-none"
              />
              <p className="text-xs text-gray-500 mt-1 font-tiro-bangla">
                এই বক্সটি শুধুমাত্র "ফটোকার্ড থেকে খবর যাচাই" এর জন্য ব্যবহার
                হবে
              </p>
            </div>
          )}

          {/* Options - Horizontal Layout */}
          {!showCrop && (
            <div className="flex flex-wrap gap-3">
              {options.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    // show loading overlay and then call handler
                    // eslint-disable-next-line no-console
                    console.log(
                      `[ImageOptionsModal] option clicked: ${option.name}`
                    );
                    setIsLoading(true);

                    // Pass cropped image and user message if available
                    // Only pass user message for Photocard news verification
                    const messageToPass =
                      option.name === "Photocard news verification"
                        ? userMessage.trim() || undefined
                        : undefined;

                    // Call the parent handler; we intentionally do NOT call onClose here
                    // so the loading overlay remains visible until navigation occurs.
                    onSelectOption(
                      option.name,
                      croppedImageUrl || undefined,
                      messageToPass
                    );
                  }}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-white transition-all duration-200 transform ${isLoading ? "opacity-60 cursor-not-allowed scale-100" : "hover:scale-105 active:scale-95"} ${option.color} ${option.hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // If loading, render a full-screen overlay with Loading via portal so it sits above everything.
  // We keep the modal portal as well; when isLoading is true the overlay will cover the viewport.
  if (typeof document !== "undefined") {
    return (
      <>
        {createPortal(modal, document.body)}
        {isLoading &&
          createPortal(
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-white bg-opacity-95">
              <div className="w-full max-w-xl mx-auto p-6">
                <Loading />
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  return null;
};

export default ImageOptionsModal;
