// Layer/Top/Component/Quran/Layout/Safhah/Index.tsx
import React, { useMemo, useState } from "react";
import { WordByWord } from "@/Top/Component/Word-By-Word";
import { useAudio } from "@/Middle/Context/Audio-Context";
import { PageLines } from "./Main";
import type { PageViewProps, ResolvedWord } from "./Types";
import type { AssembledVerse } from "@/Bottom/API/Quran";

export function PageView({
  surah,
  assembledSurah,
  showArabicText,
  hoverTranslation,
  fontClass,
  arabicFontSize,
  translationFontSize,
  verseRefs,
  wordSpacing = "1.8px",
}: PageViewProps) {
  const { verses, lines } = assembledSurah;
  const { activeVerse, activeWord } = useAudio();
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);

  const pages = useMemo(() => {
    const startPage = surah.pages[0];
    const endPage = surah.pages[1];
    const totalPages = endPage - startPage + 1;
    const versesPerPage = Math.ceil(verses.length / totalPages);
    const result: { pageNumber: number; verses: AssembledVerse[] }[] = [];

    for (let i = 0; i < totalPages; i++) {
      const pageVerses = verses.slice(i * versesPerPage, (i + 1) * versesPerPage);
      if (pageVerses.length > 0) result.push({ pageNumber: startPage + i, verses: pageVerses });
    }

    return result;
  }, [surah, verses]);

  const verseMap = useMemo(() => {
    const map = new Map<number, AssembledVerse>();
    for (const verse of verses) map.set(verse.verseNumber, verse);
    return map;
  }, [verses]);

  const resolvedLines = useMemo<ResolvedWord[][]>(() => {
    if (!lines) return [];

    return lines.map((lineRefs) =>
      lineRefs.map((ref) => {
        const [ayahStr, wordStr] = ref.split(":");
        const ayah = parseInt(ayahStr, 10);
        const wordPos = parseInt(wordStr, 10);
        const verse = verseMap.get(ayah) ?? null;
        const wordIndex = wordPos - 1;
        const glyph = verse?.words[wordIndex] ?? ref;
        const isVerseEnd = !!verse && wordIndex === verse.words.length - 1;
        const isVerseNumber = verse === null;
        
        let verseNumber: number | undefined;
        if (isVerseNumber && glyph.includes(':')) {
          const parts = glyph.split(':');
          verseNumber = parseInt(parts[0], 10);
        }

        return { glyph, verse, wordIndex, isVerseEnd, isVerseNumber, verseNumber };
      })
    );
  }, [lines, verseMap]);

  const resolvedLinesByPage = useMemo(() => {
    return pages.map((page) => {
      const pageVerseNumbers = new Set(page.verses.map((v) => v.verseNumber));
      return resolvedLines.filter((line) =>
        line.some((word) => {
          if (word.verse !== null) {
            return pageVerseNumbers.has(word.verse.verseNumber);
          }
          if (word.isVerseNumber && word.verseNumber) {
            return pageVerseNumbers.has(word.verseNumber);
          }
          return false;
        })
      );
    });
  }, [pages, resolvedLines]);

  return (
    <div className="space-y-12">
      {pages.map((page, pageIdx) => (
        <div key={page.pageNumber} className="glass-container !rounded-xl overflow-hidden !block">
          <div className="pt-4 px-6 sm:px-8 pb-0">
            {showArabicText && (
              lines ? (
                <PageLines
                  resolvedLines={resolvedLinesByPage[pageIdx]}
                  fontClass={fontClass}
                  arabicFontSize={arabicFontSize}
                  wordSpacing={wordSpacing}
                  surahId={surah.id}
                  verseRefs={verseRefs}
                  hoveredVerse={hoveredVerse}
                  setHoveredVerse={setHoveredVerse}
                />
              ) : hoverTranslation ? (
                <WordByWord
                  verses={page.verses.map((v) => ({
                    verseNumber: v.verseNumber,
                    words: v.words,
                    wbwTranslation: v.wbwTranslation,
                  }))}
                  surahId={surah.id}
                  align="right"
                  wordSpacing={wordSpacing}
                  fontClass={fontClass}
                  fontSizeOverride={arabicFontSize}
                />
              ) : (
                <div
                  className={`${fontClass} leading-[2.8] text-justify`}
                  dir="rtl"
                  style={{ fontSize: arabicFontSize, textAlignLast: "right", wordSpacing }}
                >
                  {page.verses.map((verse) => (
                    <span
                      key={verse.verseNumber}
                      ref={(el) => {
                        if (el) verseRefs.current.set(
                          verse.verseNumber,
                          el as unknown as HTMLDivElement,
                        );
                      }}
                      className="inline"
                    >
                      {verse.words.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className={`select-text transition-colors duration-200
                            ${verse.verseNumber === activeVerse && wIdx === activeWord
                              ? "text-emerald-500 animate-pulse"
                              : hoveredVerse === verse.verseNumber
                                ? "bg-primary/20 rounded px-0.5"
                                : "text-foreground"}
                          `}
                        >
                          {word}{" "}
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              )
            )}

            {!showArabicText && (
              <div className="space-y-1">
                {page.verses.map((verse) => (
                  <p
                    key={verse.verseNumber}
                    className={`text-foreground leading-relaxed transition-colors duration-200
                      ${hoveredVerse === verse.verseNumber ? "bg-primary/10 rounded px-1" : ""}
                    `}
                    style={{ fontSize: translationFontSize }}
                  >
                    {verse.translation ?? null}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center pt-1 pb-2">
            <span className="text-xs text-muted-foreground">{page.pageNumber}</span>
          </div>
        </div>
      ))}
    </div>
  );
}