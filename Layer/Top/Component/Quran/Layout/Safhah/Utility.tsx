// Layer/Top/Component/Quran/Layout/Safhah/Utility.tsx
import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { getWordAudioUrl, getAyahAudioUrl } from "@/Bottom/API/Quran";
import { useApp } from "@/Middle/Context/App-Context";
import type { WordTooltipProps } from "./Types";

export function WordTooltip({ 
  translation, 
  enabled, 
  onClick, 
  onMouseEnter, 
  onMouseLeave, 
  children 
}: WordTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  if (!enabled) {
    return <>{children}</>;
  }

  const tooltip = translation && pos
    ? createPortal(
        <span
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y - 8,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
          className="glass-tooltip rounded px-2 py-1 text-sm font-medium shadow-lg"
          dir="ltr"
        >
          {translation}
        </span>,
        document.body,
      )
    : null;

  return (
    <span
      style={{ position: "relative", display: "inline" }}
      onClick={onClick}
      onMouseEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top });
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setPos(null);
        onMouseLeave?.();
      }}
    >
      {children}
      {tooltip}
    </span>
  );
}

export function useAudioPlayback(surahId: number) {
  const { hoverRecitation, selectedReciter } = useApp();
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (url: string, key: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => { audioRef.current = null; setPlayingKey(null); };
    audio.onerror = () => { audioRef.current = null; setPlayingKey(null); };
    audio.play().catch(() => { audioRef.current = null; setPlayingKey(null); });
  };

  const playWordAudio = async (verseNumber: number, wordIndex: number) => {
    if (!hoverRecitation) return;
    const key = `word-${verseNumber}-${wordIndex}`;
    if (playingKey === key) return;
    setPlayingKey(key);

    const wordUrl = await getWordAudioUrl(surahId, verseNumber, wordIndex + 1);
    if (wordUrl) {
      playAudio(wordUrl, key);
    } else {
      const ayahUrl = await getAyahAudioUrl(surahId, verseNumber, selectedReciter);
      if (ayahUrl) playAudio(ayahUrl, key);
      else setPlayingKey(null);
    }
  };

  const playVerseAudio = async (verseNumber: number) => {
    const key = `ayah-${verseNumber}`;
    if (playingKey === key) return;
    setPlayingKey(key);

    const ayahUrl = await getAyahAudioUrl(surahId, verseNumber, selectedReciter);
    if (ayahUrl) playAudio(ayahUrl, key);
    else setPlayingKey(null);
  };

  const isPlaying = (key: string) => playingKey === key;

  return { playingKey, playWordAudio, playVerseAudio, isPlaying };
}

export const extractVerseNumberFromMarker = (glyph: string): number | null => {
  if (!glyph) return null;
  if (glyph.includes(':')) {
    const parts = glyph.split(':');
    const maybeVerse = parts[0];
    const num = parseInt(maybeVerse, 10);
    return isNaN(num) ? null : num;
  }
  const num = parseInt(glyph, 10);
  return isNaN(num) ? null : num;
};