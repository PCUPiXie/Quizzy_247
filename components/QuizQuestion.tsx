"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  selectedOption?: string;
  correctOption?: string;
}

export function QuizQuestion({
  question,
  options,
  onSelect,
  selectedOption,
  correctOption,
}: QuizQuestionProps) {
  const isAnswered = !!selectedOption;

  const getVariant = (option: string) => {
    if (!isAnswered) return "outline";
    if (option === correctOption) return "default";
    if (option === selectedOption && option !== correctOption) return "destructive";
    return "outline";
  };

  const getClassName = (option: string) => {
    if (!isAnswered) return "h-16 text-lg justify-start px-6 font-medium border-2 hover:border-primary/50 transition-all";
    if (option === correctOption)
      return "h-16 text-lg justify-start px-6 font-medium border-2 border-green-500 bg-green-500 text-white hover:bg-green-500 transition-all";
    if (option === selectedOption && option !== correctOption)
      return "h-16 text-lg justify-start px-6 font-medium border-2 border-red-500 bg-red-500 text-white hover:bg-red-500 transition-all";
    return "h-16 text-lg justify-start px-6 font-medium border-2 opacity-50 transition-all";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-8 shadow-md border-border/50 min-h-[160px] flex items-center justify-center text-center">
        <h2 className="text-2xl font-semibold leading-tight text-foreground/90">
          Q: {question}
        </h2>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          return (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => onSelect(option)}
              className={cn(
                "rounded-xl text-left",
                getClassName(option)
              )}
            >
              <span className="mr-4 opacity-60 font-bold">{letter}.</span>
              {/* Strip "A. " etc. prefix if AI already included it */}
              {option.replace(/^[A-D]\.\s*/, "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
