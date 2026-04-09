"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full max-w-lg aspect-[4/3] cursor-pointer group perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-all duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center shadow-lg border-2">
          <p className="text-2xl font-medium leading-relaxed">{front}</p>
          <p className="mt-8 text-sm text-muted-foreground animate-pulse">Tap to flip</p>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 text-center shadow-lg border-2 bg-secondary/20">
          <p className="text-2xl font-medium leading-relaxed text-foreground/90">{back}</p>
        </Card>
      </div>
    </div>
  );
}
