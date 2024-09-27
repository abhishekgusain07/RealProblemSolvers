import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";


export const createNotification = internalMutation({
  args: { userId: v.id("userInfo"), type: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      content: args.content,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const performMatching = internalAction({
  handler: async (ctx): Promise<{ user1: string; user2: string; matchId: string }[]> => {
    const matchedPairs: { user1: string; user2: string; matchId: string }[] = [];
    
    while (true) {
      // Get all users in the waiting queue
      const waitingUsers = await ctx.runQuery(internal.matching.getWaitingUsers);
      console.log(`Found ${waitingUsers.length} users waiting for a match`);

      if (waitingUsers.length < 2) {
        console.log("Not enough users to make a match. Ending process.");
        break; // Not enough users to make a match
      }
      
      // Randomly select two users
      const randomIndices = getRandomPair(waitingUsers.length);
      const user1 = waitingUsers[randomIndices[0]];
      const user2 = waitingUsers[randomIndices[1]];
      
      // Check if both users are still active
      const user1Info = await ctx.runQuery(internal.matching.getUserInfo, { userId: user1.userId });
      const user2Info = await ctx.runQuery(internal.matching.getUserInfo, { userId: user2.userId });
      
      if (!user1Info || !user2Info || user1Info.status !== "waiting" || user2Info.status !== "waiting") {
        // One or both users are no longer available, remove them from queue
        await ctx.runMutation(internal.matching.removeFromWaitingQueue, { userId: user1.userId });
        await ctx.runMutation(internal.matching.removeFromWaitingQueue, { userId: user2.userId });
        continue;
      }
      
      // Create a match
      const matchId = await ctx.runMutation(internal.matching.createMatch, { user1Id: user1.userId, user2Id: user2.userId });
      
      // Update user statuses
      await ctx.runMutation(internal.matching.updateUserStatus, { userId: user1.userId, status: "deciding", currentMatch: matchId });
      await ctx.runMutation(internal.matching.updateUserStatus, { userId: user2.userId, status: "deciding", currentMatch: matchId });
      
      // Remove users from waiting queue
      await ctx.runMutation(internal.matching.removeFromWaitingQueue, { userId: user1.userId });
      await ctx.runMutation(internal.matching.removeFromWaitingQueue, { userId: user2.userId });


      // Create notifications for matched users
      await ctx.runMutation(internal.matching.createNotification, {
        userId: user1.userId,
        type: "newMatch",
        content: `You've been matched with ${user2Info.userName}!`,
      });
      await ctx.runMutation(internal.matching.createNotification, {
        userId: user2.userId,
        type: "newMatch",
        content: `You've been matched with ${user1Info.userName}!`,
      });

      
      console.log(`Created match: ${matchId} between users ${user1.userId} and ${user2.userId}`);
      matchedPairs.push({ user1: user1.userId, user2: user2.userId, matchId });
    }
    
    console.log(`Matching process completed. Created ${matchedPairs.length} matches.`);
    return matchedPairs;
  },
});
  

  
  function getRandomPair(max:number) {
    const index1 = Math.floor(Math.random() * max);
    let index2 = Math.floor(Math.random() * (max - 1));
    if (index2 >= index1) index2++;
    return [index1, index2];
  }
  
  export const getWaitingUsers = internalQuery({
    handler: async (ctx) => {
      return await ctx.db
        .query("waitingQueue")
        .collect();
    },
  });
  
  export const getUserInfo = internalQuery({
    args: { userId: v.id("userInfo") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.userId);
    },
  });
  
  export const removeFromWaitingQueue = internalMutation({
    args: { userId: v.id("userInfo") },
    handler: async (ctx, args) => {
      const queueEntry = await ctx.db
        .query("waitingQueue")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .unique();
      if (queueEntry) {
        await ctx.db.delete(queueEntry._id);
      }
    },
  });
  
  export const createMatch = internalMutation({
    args: { user1Id: v.id("userInfo"), user2Id: v.id("userInfo") },
    handler: async (ctx, args) => {
      return await ctx.db.insert("matches", {
        user1: args.user1Id,
        user2: args.user2Id,
        status: "pending",
        createdAt: Date.now(),
      });
    },
  });
  
  export const updateUserStatus = internalMutation({
    args: { 
      userId: v.id("userInfo"), 
      status: v.union(v.literal("available"), v.literal("waiting"), v.literal("deciding"), v.literal("matched")),
      currentMatch: v.optional(v.id("matches"))
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId){
            throw new Error('Unauthorised')
        }
        const userInfo = await ctx.db.query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId)).unique()

        if(!userInfo) {
            throw new Error('Unauthorised')
        }

      await ctx.db.patch(userInfo._id, {
        status: args.status,
        currentMatched: args.currentMatch,
        lastActive: Date.now(),
      });
    },
  });