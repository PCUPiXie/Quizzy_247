"use client";

import { useRef, useState, useTransition } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/app/actions";
import {
  ArrowRight,
  FileUp,
  Loader2,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [mode, setMode] = useState<"quiz" | "flashcard">("quiz");
  const [count, setCount] = useState(10);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) setNotes("");
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    setError(null);

    if (!notes.trim() && !file) {
      setError("Please paste notes or upload a file first.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("mode", mode);
      formData.set("count", String(count));
      formData.set("notes", notes);
      if (file) formData.set("file", file);

      try {
        await generateContent(formData);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        // NEXT_REDIRECT is the expected throw from redirect() — don't treat it as an error
        if (!message.includes("NEXT_REDIRECT")) {
          setError(message);
        }
      }
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Quizzy AI</h1>
          <p className="text-xl text-muted-foreground">Learn any topic with fun</p>
        </div>

        <Card className="w-full max-w-2xl p-6 md:p-8 bg-card shadow-xl border-border/40 rounded-3xl">
          <div className="flex flex-col gap-6">
            {/* Notes / File Input Area */}
            <div className="relative">
              {file ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/20">
                  <FileText className="w-8 h-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Textarea
                  placeholder="Drop your notes here, or paste any text you want to learn from..."
                  className="min-h-[160px] resize-none rounded-2xl border-2 text-base leading-relaxed focus-visible:ring-1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isPending}
                />
              )}
            </div>

            {/* File Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isPending}
              />
              <label
                htmlFor="file-upload"
                className={cn(
                  "flex items-center gap-2 w-fit text-sm font-medium text-muted-foreground cursor-pointer",
                  "px-4 py-2 rounded-xl border hover:bg-secondary/50 transition-colors",
                  isPending && "opacity-50 pointer-events-none"
                )}
              >
                <FileUp className="w-4 h-4" />
                Upload PDF, DOCX, or TXT
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              {/* Mode selector */}
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                  Mode
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={mode === "quiz" ? "default" : "outline"}
                    className="h-12 font-semibold rounded-xl"
                    onClick={() => setMode("quiz")}
                    disabled={isPending}
                  >
                    Quiz
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "flashcard" ? "default" : "outline"}
                    className="h-12 font-semibold rounded-xl"
                    onClick={() => setMode("flashcard")}
                    disabled={isPending}
                  >
                    Flash Card
                  </Button>
                </div>
              </div>

              {/* Count selector */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                  Quiz Size
                </p>
                <div className="flex gap-2">
                  {[8, 10, 12].map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={count === size ? "default" : "outline"}
                      className="w-12 h-12 font-bold rounded-xl p-0"
                      onClick={() => setCount(size)}
                      disabled={isPending}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <Button
                type="button"
                size="icon"
                className="w-14 h-14 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <ArrowRight className="w-7 h-7" />
                )}
              </Button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-destructive font-medium px-1">⚠ {error}</p>
            )}

            {isPending && (
              <p className="text-sm text-muted-foreground text-center animate-pulse">
                Generating with AI — this may take a few seconds...
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
