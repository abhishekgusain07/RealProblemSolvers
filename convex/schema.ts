import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    
    userInfo: defineTable({
      userId: v.id("users"),
      userName: v.string(),
      github: v.string(),
      linkedin: v.optional(v.string()),
      lastProject: v.optional(v.string()),
      currentWork: v.optional(v.string()),
      profession: v.union(v.literal("student"), v.literal("workingProfessional")),
      institution: v.optional(v.string()),
      skills: v.array(v.string()),
      averageRating: v.number(),
      totalRatings: v.number(),
      projectsCompleted: v.number(),
      photoId: v.optional(v.id("_storage")),
      lastActive: v.optional(v.number()),
      status: v.optional(v.union(v.literal("available"), v.literal("waiting"), v.literal("deciding"), v.literal("matched"))),
      currentMatched: v.optional(v.id("matches"))
    })
      .index("by_userId", ["userId"])
      .index("by_rating", ["averageRating"])
      .index("by_projectsCompleted", ["projectsCompleted"])
      .index("by_profession", ["profession"])
      .index("by_skills", ["skills"])
      .index("by_status", ["status"])

      .index("by_lastActive", ["lastActive"])
      .searchIndex("search_github", {
        searchField: "github",
        filterFields: ["profession", "averageRating"]
      })
      .searchIndex("search_linkedin", {
        searchField: "linkedin",
        filterFields: ["profession", "averageRating"]
      })
      .index("by_userName", ["userName"]),
      
      waitingQueue: defineTable({
        userId: v.id("userInfo"),
        joinedAt: v.number(),
      })
        .index("by_joinedAt", ["joinedAt"])
        .index("by_userId", ["userId"]),
      
      matches: defineTable({
        user1: v.id("userInfo"),
        user2: v.id("userInfo"),
        status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
        createdAt: v.number(),
        decidedAt: v.optional(v.number()),
        })
        .index("by_user1", ["user1"])
        .index("by_user2", ["user2"])
        .index("by_status", ["status"]),
        
      notifications: defineTable({
          userId: v.id("userInfo"),
          type: v.string(),
          content: v.string(),
          read: v.boolean(),
          createdAt: v.number(),
        }).index("by_userId", ["userId"]),
});


  
// users table
// {
//     _id: Id<"users">,
//     name: string,
//     email: string,
//     role: string,
//     github: string,
//     linkedin: string,
//     lastProject: string,
//     currentWork: string,
//     isStudent: boolean,
//     school: string | null,
//     skills: string[],
//     rating: number,
//     projectsCompleted: number,
//   }
  
//   // projects table
//   {
//     _id: Id<"projects">,
//     title: string,
//     description: string,
//     requiredSkills: string[],
//     createdBy: Id<"users">,
//     status: "open" | "in_progress" | "completed",
//     teamSize: number,
//   }
  
//   // matches table
//   {
//     _id: Id<"matches">,
//     projectId: Id<"projects">,
//     users: Id<"users">[],
//     startTime: number,
//     endTime: number | null,
//     status: "active" | "completed",
//   }
  
//   // ratings table
//   {
//     _id: Id<"ratings">,
//     matchId: Id<"matches">,
//     ratedBy: Id<"users">,
//     ratedUser: Id<"users">,
//     rating: number,
//     comment: string,
//   }
  
//   // tasks table (for AI-generated tasks)
//   {
//     _id: Id<"tasks">,
//     description: string,
//     difficulty: "easy" | "medium" | "hard",
//     requiredSkills: string[],
//   }
export default schema;