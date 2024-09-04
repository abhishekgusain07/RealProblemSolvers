'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthActions } from "@convex-dev/auth/react"
import type { SignInTypes } from "../types"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { PasswordInput } from "@/components/ui/passwordInput"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { TriangleAlert } from "lucide-react"

interface SignInPageProps {
    setState: (state: SignInTypes) => void
}
export const SignInPage = ({setState}: SignInPageProps) => {
    const { signIn } = useAuthActions()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [pending, setPending] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setPending(true)
        signIn("password", {email, password, flow: "signIn"})
        .catch(() => {
            setError('Invalid email or password')
        }).finally(()=>{
            setPending(false)
        })
    }

    const handleProviderSignIn = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value)
        .finally(() => {
            setPending(false)
        })
    }
    return (
        <div className="flex h-full items-center justify-center">
             <div className="lg:px-8">
            <div className="flex justify-center items-center h-screen">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <h1 className="text-3xl font-semibold  text-center tracking-tight text-white">
            Welcome Back
          </h1>
            {
                !!error && (
                    <div className="bg-destructive/50 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert className="size-4 text-white/60" />
                        <p className="text-white/60">{error}</p>
                    </div>
                )
            }
                <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
                    <div className="grid gap-5">
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
                    <Button disabled={pending} className="w-full h-10 text-md text-white/90" variant="emerald">
                        Sign in
                    </Button>
                    </div>
                </form>
                <Separator/>
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>{handleProviderSignIn('google')}}
                        className="w-full relative"
                    >
                        <FcGoogle className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        disabled={pending}
                        onClick={()=>handleProviderSignIn('github')}
                        className="w-full relative"
                    >
                        <FaGithub className=" size-5 absolute left-4 top-1/2 -translate-y-1/2 text-2xl" />
                        Continue with Github
                    </Button>
                </div>
                <div className="flex justify-center text-md">
                <p className="text-xs text-white">
                    Don&apos;t have an account? <span 
                    onClick={()=>setState('signUp')}
                    className="text-emerald-500 hover:underline cursor-pointer" 
                    onKeyDown={(e)=>{
                        if(e.key === 'Enter'){
                            setState('signUp')
                        }
                    }}
                    >Sign Up</span>
                </p>
                </div>
                </div>
                </div>
            </div>
        </div>
    )
}
