import { useQuery } from "convex/react"
import type { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"

interface useGetUserInfoProps {
    userId: Id<"users">
}

export const useGetUserInfo = ({ userId }: useGetUserInfoProps) => {
    const userInfo = useQuery(api.userInfo.get, { userId })
    const isLoading = userInfo === undefined
    return { userInfo, isLoading }
}