"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QuizQuestion } from "@/components/QuizQuestion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import type { QuizQuestion as QuizQuestionType } from "@/lib/ai";

const FALLBACK_QUESTIONS: QuizQuestionType[] = [
  {
    question: "What is the capital of France?",
    options: ["A. London", "B. Paris", "C. Berlin", "D. Madrid"],
    correctIndex: 1,
    explanation: "Paris is the capital and largest city of France.",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["A. Venus", "B. Jupiter", "C. Mars", "D. Saturn"],
    correctIndex: 2,
    explanation: "Mars appears red due to iron oxide (rust) on its surface.",
  },
];

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const questions: QuizQuestionType[] = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return FALLBACK_QUESTIONS;
    try {
      return JSON.parse(decodeURIComponent(raw)) as QuizQuestionType[];
    } catch {
      return FALLBACK_QUESTIONS;
    }
  }, [searchParams]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const current = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const selectedOption = selectedAnswers[currentIdx];
  const correctOption = current.options[current.correctIndex];
  const isCorrect = selectedOption !== undefined && selectedOption === correctOption;

  const handleSelect = (option: string) => {
    if (selectedAnswers[currentIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: option }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const score = Object.entries(selectedAnswers).filter(([idx, opt]) => {
        const q = questions[parseInt(idx)];
        return q.options[q.correctIndex] === opt;
      }).length;
      const resultsData = encodeURIComponent(
        JSON.stringify({ questions, answers: selectedAnswers, score })
      );
      router.push(`/results?data=${resultsData}`);
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-6 mb-12">
        <Progress value={progress} className="h-3 flex-1" />
        <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
          {currentIdx + 1} / {questions.length}
        </span>
        <Link href="/flashcard">
          <Button variant="outline" size="sm" className="gap-2 font-medium bg-card">
            <Zap className="w-4 h-4 text-orange-400" />
            Switch Flash
          </Button>
        </Link>
      </div>

      {/* Quiz Body */}
      <div className="flex-1 flex flex-col justify-center">
        <QuizQuestion
          question={current.question}
          options={current.options}
          onSelect={handleSelect}
          selectedOption={selectedOption}
          correctOption={correctOption}
        />

        {/* Explanation */}
        {showExplanation && selectedOption && (
          <div
            className={`mt-6 p-4 rounded-2xl border-2 text-sm font-medium max-w-2xl mx-auto w-full transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              isCorrect
                ? "border-green-400/50 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                : "border-red-400/50 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"
            }`}
          >
            {isCorrect ? "✓ Correct! " : "✗ Incorrect. "}
            {current.explanation}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-12">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="h-12 px-6 gap-2 font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedOption}
          className="h-12 px-8 gap-2 font-semibold group shadow-lg"
        >
          {currentIdx === questions.length - 1 ? "Finish" : "Next"}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">
          Loading quiz...
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
