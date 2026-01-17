import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Function to CREATE a new blank document
export const create = mutation({
  args: { title: v.string() }, 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      ownerId: identity.subject,
      initialContent: "",
    });

    return documentId;
  },
});

// 2. Function to GET all documents (Using Filter Fix)
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("ownerId"), identity.subject))
      .collect();
  },
});

// ... keep imports and existing create/get functions ...

// 3. Function to GET a single document by its ID
// 3. Function to GET a single document by its ID
export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }

    // --- 👇 ADD THESE LOGS TO DEBUG 👇 ---
    console.log("WHO AM I?", identity?.subject);
    console.log("WHO OWNS THIS DOC?", document.ownerId);
    // -------------------------------------

    // Security: Only allow the owner (or public) to see it
    if (document.ownerId !== identity?.subject) {
      throw new Error("Unauthorized");
    }

    return document;
  },
});

// 4. Function to UPDATE a document (Title or Content)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()), // Useful later
    icon: v.optional(v.string()),       // Useful later
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...rest } = args;

    // Security: Check if document exists and belongs to user
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.ownerId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Update the document with whatever new data was sent
    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});