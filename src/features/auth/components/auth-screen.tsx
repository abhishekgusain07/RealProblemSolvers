"use client"

import { useState } from "react";
import type { SignInTypes } from "../types";
import { SignUpPage } from "./signUpPage";
import { SignInPage } from "./signInPage";
import Head from "next/head";

const AuthScreen = () => {
    const [state, setState] = useState<SignInTypes>('signIn')
    return (
        <div className="grid h-screen grid-cols-1 lg:grid-cols-2 bg-[url('/bg/bg.jpg')] bg-cover bg-center">
            <Head>
                <title>
                    {
                        state === 'signIn' ? 'SignIn' : 'SignUp'
                    }
                </title>
            </Head>
            {/* Todo: Add Logo */}
            <div className="order-1 w-[80vw] mx-auto md:w-full lg:order-2 bg-none md:bg-black/20">
                {
                    state === 'signIn' ? <SignInPage setState={setState}/> : <SignUpPage setState={setState}/>
                }
            </div>
            <div className="hidden lg:block order-1 lg:order-1">
                <div className="h-full w-full ">
                    <div className="h-full w-full flex flex-col justify-center items-center">
                        <h1 className="text-white text-4xl font-bold">
                            Welcome to <span className="text-primary text-emerald-300">
                                RealProblemSolvers
                            </span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthScreen;