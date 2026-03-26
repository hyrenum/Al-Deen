import { useState, useRef, useEffect } from "react";
import { X, BookOpen, List, Layers, Clock } from "lucide-react";
import { surahList } from "@/Bottom/API/Quran";

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  filterType: "surah" | "juz" | "hizb" | "page" | "revelation" | null;
  setFilterType: (type: "surah" | "juz" | "hizb" | "page" | "revelation" | null) => void;
  selectedSurah: number | null;
  setSelectedSurah: (surah: number | null) => void;
  selectedAyah: number | null;
  setSelectedAyah: (ayah: number | null) => void;
  revelationOrder: "asc" | "desc";
  setRevelationOrder: (order: "asc" | "desc") => void;
  onApply: () => void;
  onReset: () => void;
}

export function Filter({
  isOpen,
  onClose,
  filterType,
  setFilterType,
  selectedSurah,
  setSelectedSurah,
  selectedAyah,
  setSelectedAyah,
  revelationOrder,
  setRevelationOrder,
  onApply,
  onReset,
}: FilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedSurahMeta = selectedSurah ? surahList.find(s => s.id === selectedSurah) : null;
  const ayahs = selectedSurahMeta ? Array.from({ length: selectedSurahMeta.numberOfAyahs }, (_, i) => i + 1) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 z-50">
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Filter</h3>
          {(filterType || selectedSurah) && (
            <button onClick={onReset} className="text-xs text-muted-foreground hover:text-primary">
              Clear
            </button>
          )}
        </div>

        {/* Filter Type Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setFilterType("surah");
              setSelectedSurah(null);
              setSelectedAyah(null);
            }}
            className={`glass-btn p-2 text-xs ${
              filterType === "surah" ? "bg-primary/20 text-primary" : ""
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => {
              setFilterType("juz");
              setSelectedSurah(null);
              setSelectedAyah(null);
            }}
            className={`glass-btn p-2 text-xs ${
              filterType === "juz" ? "bg-primary/20 text-primary" : ""
            }`}
          >
            Juz
          </button>
          <button
            onClick={() => {
              setFilterType("hizb");
              setSelectedSurah(null);
              setSelectedAyah(null);
            }}
            className={`glass-btn p-2 text-xs ${
              filterType === "hizb" ? "bg-primary/20 text-primary" : ""
            }`}
          >
            Hizb
          </button>
          <button
            onClick={() => {
              setFilterType("page");
              setSelectedSurah(null);
              setSelectedAyah(null);
            }}
            className={`glass-btn p-2 text-xs ${
              filterType === "page" ? "bg-primary/20 text-primary" : ""
            }`}
          >
            Page
          </button>
        </div>

        {/* Surah & Revelation Section */}
        {(filterType === "surah" || filterType === "revelation") && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            {/* Surah Dropdown */}
            {filterType === "surah" && (
              <div>
                <select
                  value={selectedSurah || ""}
                  onChange={(e) => {
                    setSelectedSurah(parseInt(e.target.value));
                    setSelectedAyah(null);
                  }}
                  className="glass-input w-full px-3 py-2 rounded-xl text-sm"
                >
                  <option value="">Select Surah</option>
                  {surahList.map((surah) => (
                    <option key={surah.id} value={surah.id}>
                      {surah.id}. {surah.englishName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ayah Dropdown */}
            {filterType === "surah" && selectedSurah && (
              <div>
                <select
                  value={selectedAyah || ""}
                  onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
                  className="glass-input w-full px-3 py-2 rounded-xl text-sm"
                >
                  <option value="">All Ayahs</option>
                  {ayahs.map((ayah) => (
                    <option key={ayah} value={ayah}>
                      Ayah {ayah}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Revelation Toggle - Shows for both Surah and Revelation filters */}
            {(filterType === "surah" || filterType === "revelation") && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Revelation Order</span>
                <div className="flex items-center gap-1 glass-btn p-0.5">
                  <button
                    onClick={() => setRevelationOrder("asc")}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                      revelationOrder === "asc" ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    Asc
                  </button>
                  <button
                    onClick={() => setRevelationOrder("desc")}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                      revelationOrder === "desc" ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    Desc
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onApply}
          className="w-full glass-btn py-2 bg-primary text-primary-foreground text-sm mt-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
}