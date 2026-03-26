// Layer/Top/Component/Quran/Layout/Safhah/Ayah/Types.ts
import type { AssembledVerse, SurahMeta } from "@/Bottom/API/Quran";

export interface VerseCardProps {
  verse: AssembledVerse;
  surah: SurahMeta;
  showArabicText: boolean;
  verseTranslation: boolean;
  translationFontSize: string;
  isHighlighted: boolean;
  verseRef?: (el: HTMLDivElement | null) => void;
  onNotesClick: () => void;
  onShareClick: () => void;
}

export interface AyahViewProps {
  surah: SurahMeta;
  verses: AssembledVerse[];
  showArabicText: boolean;
  verseTranslation: boolean;
  translationFontSize: string;
  targetVerse?: string | null;
  verseRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  onNotesClick: (ayahId: number, verseText: string) => void;
  onShareClick: (ayahId: number, verseText: string, translation?: string) => void;
}