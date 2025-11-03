"use client";

import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface LoadingContextValue {
  loading: boolean;
  setLoading: (v: boolean) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  // return a fallback when provider is missing to avoid throwing in components
  if (!ctx) {
    return {
      loading: false,
      setLoading: (_: boolean) => {},
    } as LoadingContextValue;
  }
  return ctx;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          loading ? (
            <div className="fixed overflow-hidden inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
                <div className="text-center">
                  {/* Spinning Circle Animation */}
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>

                  {/* Loading Text */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
                    পরবর্তী ধাপে যাওয়া হচ্ছে...
                  </h3>
                  <p className="text-sm text-gray-600 font-tiro-bangla">
                    একটু অপেক্ষা করুন...
                  </p>

                  {/* Progress Dots */}
                  <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null,
          document.body
        )}
    </LoadingContext.Provider>
  );
};

// small extra CSS via tailwind class equivalent for slow spin can be present in global styles, but include inline fallback
