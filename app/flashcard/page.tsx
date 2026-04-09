"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Flashcard } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { FlashcardItem } from "@/lib/ai";

const FALLBACK_CARDS: FlashcardItem[] = [
  { front: "What is Photosynthesis?", back: "The process by which plants use sunlight, water and CO₂ to produce oxygen and energy in the form of sugar." },
  { front: "Capital of France?", back: "Paris" },
  { front: "E=mc² — who proposed it?", back: "Albert Einstein, in his Special Theory of Relativity (1905)." },
  { front: "Boiling point of water?", back: "100°C (212°F) at standard atmospheric pressure." },
  { front: "Largest ocean on Earth?", back: "The Pacific Ocean, covering more than 165 million km²." },
  { front: "Which planet is the Red Planet?", back: "Mars — its red color comes from iron oxide (rust) on its surface." },
  { front: "First human on the Moon?", back: "Neil Armstrong, on July 20, 1969 (Apollo 11 mission)." },
];

function FlashcardContent() {
  const searchParams = useSearchParams();

  const cards: FlashcardItem[] = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return FALLBACK_CARDS;
    try {
      return JSON.parse(decodeURIComponent(raw)) as FlashcardItem[];
    } catch {
      return FALLBACK_CARDS;
    }
  }, [searchParams]);

  const [currentIdx, setCurrentIdx] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      {/* Top Header - Numbered Tabs */}
      <div className="flex items-center justify-between mb-16 gap-4">
        <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl overflow-x-auto no-scrollbar">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shrink-0",
                currentIdx === idx
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-secondary text-muted-foreground"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <Link href="/quiz">
          <Button variant="outline" size="sm" className="gap-2 font-medium shrink-0">
            <LayoutList className="w-4 h-4 text-primary" />
            Switch Quiz
          </Button>
        </Link>
      </div>

      {/* Flashcard Body */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-48 bg-muted/20 border border-muted-foreground/10 rounded-2xl blur-sm hidden lg:block -translate-x-12 rotate-[-4deg]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-48 bg-muted/20 border border-muted-foreground/10 rounded-2xl blur-sm hidden lg:block translate-x-12 rotate-[4deg]" />

        <Flashcard
          key={currentIdx}
          front={cards[currentIdx].front}
          back={cards[currentIdx].back}
        />
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-16 max-w-lg mx-auto w-full">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="h-12 px-6 gap-2 font-semibold shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          Prev
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentIdx(Math.min(cards.length - 1, currentIdx + 1))}
          disabled={currentIdx === cards.length - 1}
          className="h-12 px-6 gap-2 font-semibold shadow-sm"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">
          Loading flashcards...
        </div>
      }
    >
      <FlashcardContent />
    </Suspense>
  );
}
