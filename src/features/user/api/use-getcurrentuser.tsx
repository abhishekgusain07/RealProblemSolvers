import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useCurrentUser = () => {
    const data = useQuery(api.user.get)
    const isLoading = data === undefined
    return {data, isLoading}
}