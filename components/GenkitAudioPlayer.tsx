"use client";

import { LucideDownload, Music } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface GenkitAudioPlayerProps {
  text: string;
  filename?: string; // default download filename
  voice?: string;
}

export default function GenkitAudioPlayer({
  text,
  filename,
  voice,
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
        const msg = data?.error || `TTS request failed (${resp.status})`;
        setError(msg);
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
    <div className="flex flex-col gap-4 sm:flex-row">
      <audio
        className="scale-60 self-start md:scale-100"
        ref={audioElRef}
        src={audioUrl ?? undefined}
        controls
        // style={{ display: audioUrl ? undefined : "none" }}
      />

      <Button
        onClick={handlePlay}
        label={
          loading ? "জেনারেট হচ্ছে..." : audioUrl ? "অডিও প্লে" : "অডিও জেনারেট"
        }
        color="yellow"
        disabled={loading}
        icon={Music}
      />
      <Button
        color="blue"
        label="অডিও ডাউনলোড"
        icon={LucideDownload}
        onClick={handleDownload}
      />

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
