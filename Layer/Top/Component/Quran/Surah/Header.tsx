import { Info, Play, Pause, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Top/Component/UI/tooltip";
import { useAudio } from "@/Middle/Context/Audio-Context";
import { useTranslation } from "@/Middle/Hook/Use-Translation";
import { Bismillah } from "@/Top/Component/Quran/Bismillah";
import type { SurahMeta } from "@/Bottom/API/Quran";

interface SurahHeaderProps {
  surah: SurahMeta;
  showBismillah?: boolean;
  fontClass: string;          // for the Bismillah
  arabicFontSize: string;
  onInfoClick: () => void;
  onAudioClick: () => void;
}

export function SurahHeader({
  surah,
  showBismillah = true,
  fontClass,
  arabicFontSize,
  onInfoClick,
  onAudioClick,
}: SurahHeaderProps) {
  const { t } = useTranslation();
  const {
    isPlaying: isAudioPlaying,
    isLoading: isAudioLoading,
    currentSurah: audioCurrentSurah,
    playFullSurah,
    togglePlayPause,
  } = useAudio();

  const isThisSurahPlaying = audioCurrentSurah === surah.id && isAudioPlaying;

  const handleAudioClick = () => {
    onAudioClick(); // open the AudioPlayer modal

    if (isThisSurahPlaying) {
      togglePlayPause();
    } else if (audioCurrentSurah === surah.id && !isAudioPlaying) {
      togglePlayPause();
    } else {
      playFullSurah(surah.id);
    }
  };

  return (
    <div className="glass-container !rounded-xl !block w-full">
      <div className="p-4 sm:p-5 space-y-3">
        {/* Title row: surah number, Arabic name, English translation, actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            {/* Surah number */}
            <span className="text-sm font-medium text-muted-foreground">
              {surah.id}
            </span>
            {/* Arabic surah name (via special font) */}
            <div
              className="font-surah leading-tight"
              style={{ fontSize: `calc(${arabicFontSize} * 1.2)` }}
            >
              {surah.surahFontName}
            </div>
            {/* English translation */}
            <div className="text-sm text-muted-foreground">
              {surah.englishNameTranslation}
            </div>
          </div>

          {/* Action buttons as icons with tooltips */}
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onInfoClick}
                    className="p-2 rounded-lg hover:bg-muted/10 transition-colors"
                    aria-label="Surah info"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t.quran.surahInfo}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-muted/10 transition-colors disabled:opacity-50"
                    disabled={isAudioLoading}
                    onClick={handleAudioClick}
                    aria-label={isThisSurahPlaying ? "Pause" : "Play surah"}
                  >
                    {isAudioLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isThisSurahPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isThisSurahPlaying ? t.quran.pauseAudio : t.quran.playAudio}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Bismillah */}
        {showBismillah && (
          <div className="pt-2">
            <Bismillah fontClass={fontClass} fontSize={arabicFontSize} />
          </div>
        )}
      </div>
    </div>
  );
}