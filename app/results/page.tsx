"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ScoreCircle } from "@/components/ScoreCircle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Home, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { QuizQuestion } from "@/lib/ai";

interface ResultsData {
  questions: QuizQuestion[];
  answers: Record<number, string>;
  score: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();

  const resultsData: ResultsData | null = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw)) as ResultsData;
    } catch {
      return null;
    }
  }, [searchParams]);

  const questions = resultsData?.questions ?? [];
  const answers = resultsData?.answers ?? {};
  const score = resultsData?.score ?? 0;
  const total = questions.length || 10;

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col max-w-2xl mx-auto relative pb-20">
      {/* Top Left Home Button */}
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 font-medium bg-card">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>

      {/* Score Header */}
      <div className="mt-12 mb-10">
        <ScoreCircle score={score} total={total} />
      </div>

      {/* Review List */}
      <div className="flex-1 space-y-5">
        {questions.length > 0 ? (
          questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const correctAnswer = q.options[q.correctIndex];
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div key={idx} className="flex gap-4 items-start">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                )}
                <div className="space-y-2 flex-1">
                  <p className="text-base font-medium text-foreground/90 leading-snug">
                    {q.question}
                  </p>
                  <Card className="p-3 bg-secondary/30 border-none rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      {isCorrect
                        ? "Correct!"
                        : userAnswer
                        ? `You answered: ${userAnswer}`
                        : "Not answered"}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Correct answer:{" "}
                        <span className="font-semibold text-foreground">
                          {correctAnswer}
                        </span>
                      </p>
                    )}
                  </Card>
                </div>
              </div>
            );
          })
        ) : (
          // Fallback when no real data
          [
            { question: "What is capital of france?", answer: "Paris", isCorrect: true },
            { question: "Which planet is the Red Planet?", answer: "Mars", isCorrect: true },
          ].map((result, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="text-base font-medium text-foreground/90">{result.question}</p>
                <Card className="p-3 bg-secondary/30 border-none rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    Correct answer:{" "}
                    <span className="font-semibold text-foreground">{result.answer}</span>
                  </p>
                </Card>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action footer */}
      <div className="mt-12 flex justify-center">
        <Link href="/">
          <Button className="h-14 px-12 rounded-2xl gap-3 text-lg font-bold shadow-xl hover:scale-105 transition-all">
            <RotateCcw className="w-6 h-6" />
            Try Again
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground animate-pulse">Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
