import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()), // The JSON content of the doc
   content: v.string(), 
    ownerId: v.string(),                    // The Clerk User ID (Security)
    roomId: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),         // For Live Collaboration (Later)
  })
  .index("by_owner", ["ownerId"])           // Fast search by user
});