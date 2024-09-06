'use client'
import { useRouter } from "next/navigation";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useGetUserInfoById } from "@/features/userInfo/api/use-getUserInfoById";
import { Loader } from "lucide-react";
import VibrantUserProfile from "./userProfilePage";
import type { userProffesion } from "@/lib/types";


const initialUserInfo = {
    userId: "user123",
    userName: "John Doe",
    github: "johndoe",
    linkedin: "john-doe",
    lastProject: "E-commerce Website",
    currentWork: "Freelance Developer",
    profession: "workingProfessional" as userProffesion,
    institution: "Tech University",
    skills: ["JavaScript", "React", "Node.js"],
    averageRating: 4.8,
    totalRatings: 25,
    projectsCompleted: 15,
    photoId: "photo123"
  };

const UserPage = ({
    params: { userId }
}: {
    params: { userId: Id<"userInfo"> }
}) => {
    const router = useRouter()
    const { userInfo, isLoading: userInfoIsLoading} = useGetUserInfoById({userInfoId: userId})


    if(userInfoIsLoading || !userInfo) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <Loader className="size-4 animate-spin" />
            </div>
        )
    }
    return (
        <div className="h-screen flex justify-center items-center p-5">
            <VibrantUserProfile
                     initialUserInfo={initialUserInfo} />
        </div>
    )
}

export default UserPage;