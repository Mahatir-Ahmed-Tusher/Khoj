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
      v.literal("unverified"),
      v.literal("context_dependent")
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
        geography: v.optional(
          v.union(v.literal("bangladesh"), v.literal("international"))
        ),
        tierBreakdown: v.optional(
          v.object({
            tier1: v.number(),
            tier2: v.number(),
            tier3: v.number(),
            tier4: v.number(),
            tier5: v.number(),
            general: v.number(),
          })
        ),
      })
    ),
    generatedAt: v.string(),
    pageUrl: v.string(),
  }),
});
