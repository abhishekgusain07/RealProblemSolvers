'use client'
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import { UserButton } from "@/features/auth/components/userButton";
import { useGetUserInfo } from "@/features/userInfo/api/use-get-userinfo";
import { useCreateUserInfoModal } from "@/features/userInfo/store/create-userinfo-module";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter()
  const { signOut } = useAuthActions();
  const { userInfo, isLoading } = useGetUserInfo();
  const [open, setOpen] = useCreateUserInfoModal()
  // if(isLoading || !userInfo) {
  //   return <div>First time user...</div>
  // }
  useEffect(() => {
    if(isLoading)return;

    if(userInfo){
      router.push('/home')
    }else if(!open){
      setOpen(true)
    }
  }, [isLoading, userInfo, router, setOpen, open])
  return (
    <>
      <div className="h-screen w-full bg-white text-center items-center justify-center flex">
        <UserButton />
        <div>
        </div>
      </div>
    </>
  );
}
