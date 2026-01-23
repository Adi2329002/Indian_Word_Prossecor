import { v } from "convex/values";
import { action } from "./_generated/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export const auth = action({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Prepare the session
    const session = liveblocks.prepareSession(identity.subject, {
      userInfo: {
        name: identity.name || "Anonymous",
        avatar: identity.pictureUrl,
      },
    });

    // Grant full access to this specific room
    session.allow(args.roomId, session.FULL_ACCESS);

    const { body} = await session.authorize();
    return JSON.parse(body);
  },
});