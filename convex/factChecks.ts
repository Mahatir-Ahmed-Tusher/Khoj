import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Create a new fact check
export const create = mutation({
  args: {
    id: v.string(),
    query: v.string(),
    result: v.string(),
    timestamp: v.number(),
    verdict: v.union(
      v.literal("true"),
      v.literal("false"),
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
  },
  handler: async ({ db }, factCheck) => {
    await db.insert("factChecks", factCheck);
  },
});

// ✅ Fetch all fact checks
export const list = query({
  args: {},
  handler: async ({ db }) => {
    return await db.query("factChecks").order("desc").collect();
  },
});

// ✅ Clear all fact checks
export const clear = mutation({
  args: {},
  handler: async ({ db }) => {
    const all = await db.query("factChecks").collect();
    for (const check of all) {
      await db.delete(check._id);
    }
  },
});

// ✅ Check for existing fact check by query
export const getByQuery = query({
  args: { query: v.string() },
  handler: async ({ db }, { query }) => {
    return await db
      .query("factChecks")
      .filter((q) => q.eq(q.field("query"), query))
      .first();
  },
});

// ✅ Check for existing fact check by ID
export const getByID = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    return await db
      .query("factChecks")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});
