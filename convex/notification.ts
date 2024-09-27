import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const get = query({
    args:{},
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId)return null

        const userInfo = await ctx.db
        .query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId))
        .unique()

        if(!userInfo) {
            return null
        }

        const notifications = await ctx.db 
        .query("notifications")
        .withIndex("by_userId", (q) => q.eq("userId", userInfo._id))
        .order("desc")
        .take(10)

        return notifications
    }
})

export const markNotificationAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
      const userId = await auth.getUserId(ctx);
      if (!userId) {
        throw new Error('Unauthorized');
      }
      const notification = await ctx.db.get(args.notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }
      const userInfo = await ctx.db.query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId))
        .unique();
      if (!userInfo || notification.userId !== userInfo._id) {
        throw new Error('Unauthorized');
      }
      await ctx.db.patch(args.notificationId, { read: true });
    },
  });