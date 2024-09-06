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
    })
      .index("by_userId", ["userId"])
      .index("by_rating", ["averageRating"])
      .index("by_projectsCompleted", ["projectsCompleted"])
      .index("by_profession", ["profession"])
      .index("by_skills", ["skills"])
      .searchIndex("search_github", {
        searchField: "github",
        filterFields: ["profession", "averageRating"]
      })
      .searchIndex("search_linkedin", {
        searchField: "linkedin",
        filterFields: ["profession", "averageRating"]
      })
      .index("by_userName", ["userName"]),
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