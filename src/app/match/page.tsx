'use client'
import { Button } from "@/components/ui/button";
import { useGetActiveUsers } from "@/features/userInfo/api/use-getActiveUser";
import { useUpdateUserActivity } from "@/features/userInfo/api/use-updateUserActivity";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import { toast } from "sonner";

const MatchPage = () => {
    const { mutate: updateUserActivity, isPending: updateUserActivityPending } = useUpdateUserActivity();
    const [startSearching, setStartSearching] = useState<boolean>(false)

    useEffect(() => {
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
    }, [updateUserActivity, startSearching]);

    const {activeUsers, isLoading} = useGetActiveUsers()

    const handlePairing = () => {

    }
    
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
            <Button variant="emerald" onClick={() => handlePairing}>
                {
                    startSearching ? "Pairing" : "Start Pairing"
                }
            </Button>
        </div>
    )
}

export default MatchPage