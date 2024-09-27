'use client'
import { Button } from "@/components/ui/button";
import NotificationComponent from "@/features/notifications/components/notifications";
import { useDeleteMatchRequest } from "@/features/userInfo/api/use-deleteMatchRequest";
import { useGetUserInfo } from "@/features/userInfo/api/use-get-userinfo";
import { useGetActiveUsers } from "@/features/userInfo/api/use-getActiveUser";
import { useRequestMatch } from "@/features/userInfo/api/use-requestMatch";
import { useUpdateUserActivity } from "@/features/userInfo/api/use-updateUserActivity";
import { useCreateUserInfoModal } from "@/features/userInfo/store/create-userinfo-module";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";

const MatchPage = () => {
    const { userInfo, isLoading: userInfoLoading } = useGetUserInfo();
  const [open, setOpen] = useCreateUserInfoModal()
    const { mutate: updateUserActivity, isPending: updateUserActivityPending } = useUpdateUserActivity();
    const [startSearching, setStartSearching] = useState<boolean>(false)

    useEffect(() => {
        if(userInfoLoading)return
        if(userInfo) {
            
        } else if(!userInfo && !open) {
            setOpen(true)
        }
        if(!startSearching)return;
        const interval = setInterval(() => {
            updateUserActivity({
                onSuccess: () => {
                    toast.success("User Last active updated");
                },
                onError: () => {
                    toast.error("User last active cannot be updated"); 
                }
            });
        }, 60 * 1000); // 60 seconds

        return () => clearInterval(interval); 
    }, [updateUserActivity, startSearching, userInfo, setOpen, open, userInfoLoading]);

    const {activeUsers, isLoading:activeUsersLoading} = useGetActiveUsers()
    const {mutate:requestMatching, isPending: requestMatchPending} = useRequestMatch()
    const {mutate:stopMatching, isPending: stopMatchingPending} = useDeleteMatchRequest()
    const handlePairing = () => {
        setStartSearching(true)
        requestMatching()
    }
    const handleStopPairing = () => {
        setStartSearching(false)
        stopMatching()
    }
    if(activeUsersLoading) {
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
            <Button variant="emerald" onClick={() => handlePairing()} disabled={startSearching}>
                {
                    startSearching ? "Pairing" : "Start Pairing"
                }
            </Button>
            <Button variant="destructive" disabled={!startSearching} onClick={() => handleStopPairing()}>
                Stop matching
            </Button>
            <NotificationComponent />
        </div>
    )
}

export default MatchPage