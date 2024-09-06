import { useQuery } from "convex/react"
import type { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"


export const useGetUserInfo = () => {
    const userInfo = useQuery(api.userInfo.get)
    const isLoading = userInfo === undefined
    return { userInfo, isLoading }
}