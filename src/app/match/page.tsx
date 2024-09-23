'use client'
import { useGetActiveUsers } from "@/features/userInfo/api/use-getActiveUser";
import { useUpdateUserActivity } from "@/features/userInfo/api/use-updateUserActivity";
import { Loader2 } from "lucide-react";
import { useEffect } from "react"
import { toast } from "sonner";

const MatchPage = () => {
    const { mutate: updateUserActivity, isPending: updateUserActivityPending } = useUpdateUserActivity();
    useEffect(() => {
        const interval = setInterval(() => {
            updateUserActivity({
                onSuccess: () => {
                    toast.success("User Last active updated");
                },
                onError: () => {
                    toast.error("User last active cannot be updated"); // Changed to toast.error for error messages
                }
            });
        }, 60 * 1000); // 60 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [updateUserActivity]);
    const {activeUsers, isLoading} = useGetActiveUsers()
    if(isLoading) {
        return (
            <div className="h-screen flex items-center flex-row justify-center">
                <Loader2  className="size-4 animate-spin"/>
            </div>
        )
    }
    return (
        <div>
            <h1>Match With Developers</h1>
            {
                activeUsers?.map(user => (
                    <div key={user._id}>
                        <p>{user.userName}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default MatchPage