"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-50">
      <div className="w-full max-w-lg space-y-8 text-center animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/5 rounded-full animate-bounce">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Generating your session...</h2>
            <p className="text-muted-foreground">Our AI is processing your notes into fun challenges.</p>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
