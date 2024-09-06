'use client'


import { CreateUserInfoModal } from "@/features/userInfo/components/createUserInfomodal";
import { useEffect, useState } from "react";

export const Modal = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if(!mounted) return null;
    return (
        <div>
            <CreateUserInfoModal />
        </div>
    )
}