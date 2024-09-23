import { useQuery } from "convex/react"
import type { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"


export const useGetActiveUsers = () => {
    const activeUsers = useQuery(api.userInfo.getActiveUser)
    const isLoading = activeUsers === undefined
    return { activeUsers, isLoading }
}