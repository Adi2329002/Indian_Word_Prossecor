import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()), 
    ownerId: v.string(),
    roomId: v.optional(v.string())
  }).index("by_owner", ["ownerId"]),

  // NEW: Table to store snapshots
  versions: defineTable({
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(), // The HTML/JSON snapshot
    authorId: v.string(),
  }).index("by_document", ["documentId"]),
});