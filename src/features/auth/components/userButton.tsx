'use client';

import { 
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Loader, LogOut, UserIcon } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/features/user/api/use-getcurrentuser";


export const UserButton = () => {
    const {data, isLoading} = useCurrentUser()
    const {signOut} = useAuthActions();
    if(isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }
    if(!data) {
        return null;
    }
    const {image, name, email} = data;
    const avatarFallback = name?.charAt(0).toUpperCase()
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="rounded-md size-10 hover:opacity-75 transition">
                    <AvatarImage className="rounded-md" src={image} alt={name} />
                    <AvatarFallback className="rounded-md bg-blue-400 text-white">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem className="h-10" onClick={() => signOut()} >
                    <LogOut className="size-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
