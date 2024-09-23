'use client';
import { useUpdateUserActivity } from "@/features/userInfo/api/use-updateUserActivity"; // Ensure this path is correct
import { useEffect } from "react";
import { toast } from "sonner";

export const useUpdateUserActivityHook = () => {
    const { mutate: updateUserActivity, isPending: updateUserActivityPending } = useUpdateUserActivity();
    
    useEffect(() => {
        const interval = setInterval(() => {
            updateUserActivity({
                onSuccess: () => {
                    toast.success("User Last active updated");
                },
                onError: (error) => {
                    toast.error("User last active cannot be updated"); // Changed to toast.error for error messages
                }
            });
        }, 60 * 1000); // 60 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [updateUserActivity]);
};