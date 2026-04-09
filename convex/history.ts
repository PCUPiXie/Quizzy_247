import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveHistory = mutation({
  args: {
    topic: v.string(),
    mode: v.union(v.literal("quiz"), v.literal("flashcard")),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("history", {
      topic: args.topic,
      mode: args.mode,
      data: args.data,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getHistory = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("history")
      .order("desc")
      .collect();
  },
});

export const getSingleSet = query({
  args: { id: v.id("history") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
