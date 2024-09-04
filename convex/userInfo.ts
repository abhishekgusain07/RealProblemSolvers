import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";


export const create = mutation({
    args: {
        userId: v.id("users"),
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

        const userInfo = await ctx.db.get(args.userId)

        if(userInfo) {
            throw new Error('User info already exists')
        }

        const userInfoId = await ctx.db.insert("userInfo", {
            userId: args.userId,
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
    }
})

export const get = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            throw null
        }
        const userInfo = await ctx.db.get(args.userId)
        if(!userInfo) {
            throw null
        }
        return userInfo
    }
})