"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function HistoryList() {
  const history = useQuery(api.history.getHistory);
  const router = useRouter();

  if (history === undefined) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="text-xs text-muted-foreground px-2 py-4 text-center">
        No past quizzes yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {history.map((item) => (
        <Button
          key={item._id}
          variant="ghost"
          className="w-full justify-start text-sm font-normal h-auto py-2.5 px-3 hover:bg-secondary/80 flex flex-col items-start gap-1 rounded-xl transition-all"
          onClick={() => {
            const encoded = encodeURIComponent(JSON.stringify(item.data));
            router.push(`/${item.mode}?data=${encoded}`);
          }}
        >
          <span className="truncate w-full font-medium text-left">
            {item.topic}
          </span>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 uppercase h-4 font-bold tracking-wider"
            >
              {item.mode}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}
