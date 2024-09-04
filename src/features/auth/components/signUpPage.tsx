'use client'
import { FaGithub } from "react-icons/fa";
import type { SignInTypes } from "../types"
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/ui/passwordInput";
import { Input } from "@/components/ui/input";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

interface SignUpPageProps {
    setState: (state: SignInTypes) => void
}
export const SignUpPage = ({setState}: SignUpPageProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const {signIn} = useAuthActions()

    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(password !== confirmPassword){
            setError('Passwords do not match')
            return
        }
        setPending(true)
        signIn("password", {name, email, password, flow: "signUp"})
        .catch(() => {
            setError('Something went wrong')
        }).finally(()=>{
            setPending(false)
        })
    }
    const onProviderSignUp = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value)
        .finally(()=>{ 
            setPending(false)
        })
    }
    return (
        <div className="lg:px-8">
            <div className="flex justify-center items-center h-screen">
            <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
                <div className="flex flex-col items-center justify-center gap-[-1px]">
                <h1 className="text-3xl font-semibold  text-center tracking-tight text-white/80">
                    Welcome Back
                </h1>
                <p className="text-xs text-emerald-300 text-center">use Google or Github to sign up</p>
                </div>
            {
                !!error && (
                    <div className="bg-destructive/70 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert className="size-4 text-white/60" />
                        <p className="text-white/60">{error}</p>
                    </div>
                )
            }
                <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
                    <div className="grid gap-3 mt-2">
                    <Input 
                        disabled={pending}
                        value={name}
                        placeholder="Full Name"
                        onChange={(e)=>{setName(e.target.value)}}
                        required={true}
                        autoCapitalize="none"
                        autoCorrect="off"
                        name="name"
                    />
                    <Input 
                        disabled={pending}
                        value={email}
                        placeholder="name@example.com"
                        onChange={(e)=>{setEmail(e.target.value)}}
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        name="email"
                        required={true}
                    />
                    <PasswordInput 
                        disabled={pending}
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>{setPassword(e.target.value)}}
                        type="password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="current-password"
                        required={true}
                    />
                    <PasswordInput 
                        disabled={pending}
                        value={confirmPassword}
                        placeholder="Confirm Password"
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        type="password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="Confirm-password"
                        required={true}
                    />
                    <Button disabled={pending} className="w-full h-10 text-gray-100" variant="emerald">
                        Sign Up
                    </Button>
                    </div>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-4 mt-3">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{onProviderSignUp('google')}}
                        className="w-full relative"
                    >
                        <FcGoogle className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{onProviderSignUp('github')}}
                        className="w-full relative"
                    >
                        <FaGithub className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-white text-center">
                    Already have an account? <span 
                    onClick={()=>setState('signIn')}
                    onKeyDown={(e)=>{
                        if(e.key === 'Enter'){
                            setState('signIn')
                        }
                    }}
                    className="text-emerald-500 hover:underline cursor-pointer"
                    >Sign In</span>
                </p>
            </div>
            </div>
        </div>
    )
}