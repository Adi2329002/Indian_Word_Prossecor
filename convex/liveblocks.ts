import { v } from "convex/values";
import { action } from "./_generated/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: "sk_dev_LmavdhN22Szapux4sdNCYFK40Kme7eNpjhXAlG9oqP3etLDRGDANog4A84BGPPNG",
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

    const { body, status } = await session.authorize();
    return JSON.parse(body);
  },
});