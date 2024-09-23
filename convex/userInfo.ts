import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";



export const getActiveUser =  query({
    args:{},
    handler: async(ctx, args) =>{
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            return null
        }
        const userInfo = await ctx.db
        .query("userInfo")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique()

        if(!userInfo) {
            return null
        }

        const twoMinutesAgo = Date.now() - ( 2 * 60 * 1000);
        const activeUsers = await ctx.db 
        .query("userInfo")
        .filter(q => q.gte(q.field("lastActive"),twoMinutesAgo))
        .collect()

        const filteredActiveUsers = activeUsers.map(user => ({
            _id: user._id,
            userName: user.userName,
            institution: user.institution
        }))

        return filteredActiveUsers
    }
})
export const updateUserActivity = mutation({
    args: {
    },
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            throw new Error("Unauthorized");
        }
        
        const userInfo = await ctx.db
        .query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId))
        .unique()
        
        if(!userInfo) {
            throw new Error("Unauthorized")
        }
        
        const updatedUserInfo = await ctx.db.patch(userInfo._id, {
            lastActive: Date.now()
        });

        return userInfo._id;
    }
});
export const update = mutation({
    args: {
        userName: v.string(),
        github: v.string(),
        linkedin: v.string(),
        lastProject: v.string(),
        currentWork: v.string(),
        institution: v.string(),
        profession: v.union(v.literal("student"), v.literal("workingProfessional")),
        skills: v.array(v.string()),
        photoId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            throw new Error('Unauthorized')
        }

        const userInfo = await ctx.db
        .query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId))
        .unique();

        if(!userInfo) {
            throw new Error('User info not found')
        }

        const updatedUserInfo = await ctx.db.patch(userInfo._id, {
            userName: args.userName,
            github: args.github,
            linkedin: args.linkedin,
            lastProject: args.lastProject,
            currentWork: args.currentWork,
            institution: args.institution,
            profession: args.profession,
            skills: args.skills,
            photoId: args.photoId,
        });
        return updatedUserInfo;
    }
})  

export const create = mutation({
    args: {
        userName: v.string(),
        github: v.string(),
        linkedin: v.optional(v.string()),
        lastProject: v.optional(v.string()),
        currentWork: v.optional(v.string()),
        profession: v.union(v.literal("student"), v.literal("workingProfessional")),
        institution: v.optional(v.string()),
        skills: v.array(v.string()),
        averageRating: v.optional(v.number()),
        totalRatings: v.optional(v.number()),
        projectsCompleted: v.optional(v.number()),
        photoId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)

        if(!userId) {
            throw new Error('Unauthorized')
        }

        const userInfo = await ctx.db
        .query("userInfo")
        .filter(q => q.eq(q.field("userId"), userId))
        .unique();

        if(userInfo) {
            throw new Error('User info already exists')
        }

        const userInfoId = await ctx.db.insert("userInfo", {
            userId: userId,
            userName: args.userName,
            github: args.github,
            linkedin: args.linkedin,
            lastProject: args.lastProject,
            currentWork: args.currentWork,
            profession: args.profession,
            institution: args.institution,
            skills: args.skills,
            averageRating: args.averageRating || 0,
            totalRatings: args.totalRatings || 0,
            projectsCompleted: args.projectsCompleted || 0,
            photoId: args.photoId,
        })
        return userInfoId
    }
})


export const get = query({
    args: {

    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            return null
        }

        const userInfo = await ctx.db
            .query("userInfo")
            .filter(q => q.eq(q.field("userId"), userId))
            .unique();
        
        if(!userInfo) {
            return null
        }

        return userInfo._id
    }
})


export const getById = query({
    args: {
        userInfoId: v.id("userInfo"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            return null
        }
        const userInfo = await ctx.db
            .query("userInfo")
            .filter(q => q.eq(q.field("userId"), userId))
            .unique();

        if(!userInfo) {
            return null
        }
        if(userInfo._id !== args.userInfoId) {
            return null
        }
        return userInfo
    }
})


export const checkUserName = query({
    args: {
        userName: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            return false
        }
        const userInfo = await ctx.db
            .query("userInfo")
            .withIndex("by_userName", (q) => q.eq(("userName"), args.userName))
            .unique();

        if(!userInfo) {
            return false
        }
        return true
    }
})


