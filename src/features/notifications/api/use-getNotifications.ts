import { useQuery } from "convex/react"
import type { Id } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"


export const useGetNotifications = () => {
    const notifications = useQuery(api.notification.get)
    const isLoading = notifications === undefined
    return { notifications, isLoading }
}