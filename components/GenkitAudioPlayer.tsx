"use client";

import React, { useEffect, useRef, useState } from "react";

interface GenkitAudioPlayerProps {
  text: string;
  filename?: string; // default download filename
  voice?: string;
  onOptionsClick?: () => void; // Callback for three-dot menu
}

export default function GenkitAudioPlayer({
  text,
  filename,
  voice,
  onOptionsClick,
}: GenkitAudioPlayerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const generateAudio = async () => {
    setError(null);
    if (!text || !text.trim()) {
      setError("No text provided");
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch("/api/gen-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        let errorMsg = data?.error || `TTS request failed (${resp.status})`;
        
        // Add more helpful error messages
        if (data?.details) {
          errorMsg += `: ${data.details}`;
        }
        if (data?.suggestion) {
          errorMsg += ` - ${data.suggestion}`;
        }
        
        console.error("TTS API Error:", errorMsg, data);
        setError(errorMsg);
        setLoading(false);
        return;
      }
      const data = await resp.json();
      const b64 = data.audioContent;
      const contentType = data.contentType || "audio/mpeg";
      if (!b64) {
        setError("No audio returned from server");
        setLoading(false);
        return;
      }

      // Convert base64 to blob
      const byteChars = atob(b64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      audioBlobRef.current = blob;

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // auto-play when generated
      setTimeout(() => {
        audioElRef.current?.play().catch(() => {});
      }, 50);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!audioUrl) {
      await generateAudio();
      return;
    }
    try {
      await audioElRef.current?.play();
    } catch (e) {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!audioBlobRef.current) return;
    const blob = audioBlobRef.current;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const ext =
      blob.type && blob.type.includes("wav")
        ? "wav"
        : blob.type && blob.type.includes("mpeg")
          ? "mp3"
          : "bin";
    a.download = filename || `audio.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Hidden audio element */}
      <audio
        className="hidden"
        ref={audioElRef}
        src={audioUrl ?? undefined}
        controls
      />

      {/* Audio Play Button */}
      <button
        onClick={handlePlay}
        disabled={loading}
        className="flex items-center justify-center p-0 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 active:scale-95"
        aria-label={loading ? "Generating audio" : audioUrl ? "Play audio" : "Generate audio"}
      >
        {loading ? (
          <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <img
            src="/icons/audio-play.png"
            alt="Play audio"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
            style={{ imageRendering: 'crisp-edges' }}
          />
        )}
      </button>

      {/* Audio Download Button */}
      <button
        onClick={handleDownload}
        disabled={!audioBlobRef.current || loading}
        className="flex items-center justify-center p-0 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 active:scale-95"
        aria-label="Download audio"
      >
        <img
          src="/icons/audio-download.png"
          alt="Download audio"
          className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </button>

      {/* Three-dot Options Menu */}
      {onOptionsClick && (
        <button
          onClick={onOptionsClick}
          className="flex items-center justify-center p-0 hover:opacity-80 transition-opacity duration-200 active:scale-95"
          aria-label="Options menu"
        >
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      )}

      {error && (
        <div className="text-xs text-red-600 max-w-xs truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}
