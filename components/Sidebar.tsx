"use client";

import { History, UserCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockHistory = [
  "Capital of France",
  "Photosynthesis Basics",
  "Quantum Physics Intro",
  "World War II Timeline",
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen border-r bg-background/50 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <LayoutGrid className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-semibold text-lg">Quizzy AI</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 px-2 py-2 text-muted-foreground">
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">History</span>
        </div>
        <Separator className="my-2" />
        <div className="space-y-1">
          {mockHistory.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-sm font-normal h-9 px-2 hover:bg-secondary/80"
            >
              <span className="truncate">{item}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto px-2">
        <Separator className="my-4" />
        <Button variant="ghost" className="w-full justify-start gap-3 h-10 px-2">
          <UserCircle className="w-5 h-5" />
          <span className="font-medium">Account</span>
        </Button>
      </div>
    </div>
  );
}
