import { useQuery } from "convex/react"
import type { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"



interface UseGetUserInfoByIdProps {
    userInfoId: Id<"userInfo">
}
export const useGetUserInfoById= ({userInfoId}: UseGetUserInfoByIdProps) => {
    const userInfo = useQuery(api.userInfo.getById, { userInfoId })
    const isLoading = userInfo === undefined
    return { userInfo, isLoading }
}