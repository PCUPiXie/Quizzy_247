"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

let convex: ConvexReactClient | null = null;

if (typeof window !== "undefined") {
  convex = new ConvexReactClient(
    process.env.NEXT_PUBLIC_CONVEX_URL!
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
