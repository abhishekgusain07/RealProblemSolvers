'use client'
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import { useGetUserInfo } from "@/features/userInfo/api/use-get-userinfo";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";

export default function Home() {
  const { signOut } = useAuthActions();
  const { userInfo, isLoading } = useGetUserInfo({ userId: "123" });
  return (
    <>
      <div className="h-screen w-full bg-white text-center items-center justify-center flex">
        <Button onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </>
  );
}
