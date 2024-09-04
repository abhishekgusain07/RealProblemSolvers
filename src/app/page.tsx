'use client'
import { Button } from "@/components/ui/button";
import AuthScreen from "@/features/auth/components/auth-screen";
import { useAuthActions } from "@convex-dev/auth/react";
import Image from "next/image";

export default function Home() {
  const {signOut} = useAuthActions();
  return (
    <>
      <div className="h-screen w-full bg-white text-center items-center justify-center flex">
        <Button onClick={() =>signOut()}>
          Logout
        </Button>
      </div>
    </>
  );
}
