import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  factChecks: defineTable({
    id: v.string(),
    query: v.string(),
    result: v.string(),
    timestamp: v.number(),
    verdict: v.union(
      v.literal("true"),
      v.literal("false"),
      v.literal("misleading"),
      v.literal("unverified")
    ),
    sources: v.array(
      v.object({
        id: v.number(),
        title: v.string(),
        url: v.string(),
        snippet: v.string(),
        language: v.optional(v.string()),
      })
    ),
    sourceInfo: v.optional(
      v.object({
        hasBengaliSources: v.boolean(),
        hasEnglishSources: v.boolean(),
        totalSources: v.number(),
      })
    ),
    generatedAt: v.string(),
    pageUrl: v.string(),
  }),
});

