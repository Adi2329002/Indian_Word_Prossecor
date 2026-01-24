import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1️⃣ CREATE DOCUMENT
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),   // ✅ MUST EXIST
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      content: args.content,   // ✅ STORE IT
      ownerId: identity.subject,
      coverImage: undefined,
      icon: undefined,
      isPublished: false,
    });

    return documentId;
  },
});


// 2️⃣ GET ALL DOCUMENTS
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

// 3️⃣ GET DOCUMENT BY ID
export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
  return null;
}

    if (!identity) {
      throw new Error("Unauthorized");
    }

    return document;
  },
});

// 4️⃣ UPDATE DOCUMENT (INCLUDING TITLE)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),  // 👈 Title support added
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(id);
    if (!existingDocument) {
      throw new Error("Not found");
    }

    // Ownership check (keep commented if testing collaboration)
    // if (existingDocument.ownerId !== identity.subject) {
    //   throw new Error("Unauthorized");
    // }

    const document = await ctx.db.patch(id, {
      ...rest,   // 👈 This will now update title when passed
    });

    return document;
  },
});
