import { query } from "./_generated/server";
import { auth } from "./auth";

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if(!userId) {
            return null
        }
        const user = await ctx.db.get(userId)
        return user
    }
})