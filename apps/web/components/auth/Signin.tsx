"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input, { PasswordInput } from "@repo/ui/input"
import {X} from "lucide-react"
import toast from "react-hot-toast";
import { signInUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { HashLoader } from "react-spinners";
import { Button } from "@repo/ui/button";
export function Signin(){
    const router=useRouter();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const mutate=useMutation({
        mutationFn:signInUser,
        onSuccess:(data)=>{
            toast.success('User Signed in successfully');
            localStorage.setItem('token',data.token)
            router.push("./dashboard")
        },
        onError: (err)=>{
            setEmail("");
            setPassword("");
            toast.error(err.message);
        }
    })
    const handleSignup=(e:any)=>{
        e.preventDefault();
        mutate.mutate({email,password})

    }
    return (
        <div className="min-h-screen bg-gray-500 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
                        <p>Sign in to sketch ideas together on CoScribe</p>
                    </div>
                    <Link href="/" className="text-gray-500 hover:text-gray-700">
                    <X size={20}/>
                    </Link>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                    title="Email address"
                    placeholder="Enter your email"
                    required={true}
                    onChange={(e:any)=>setEmail(e.target.value)}
                    type="email"
                    value={email}
                    />
                    <PasswordInput
                    title="Password"
                    placeholder="Create a password"
                    required={true}
                    onChange={(e:any)=> setPassword(e.target.value)}
                    value={password}
                    />
                    <div className="pt-2">
                        <Button text={
                            mutate.isPending ? (
                                <div className="flex justify-center">
                                    <HashLoader color="#ffffff" size={20} />
                                </div>
                                ) : (
                                "Signin"
                                )
                            } onClick={handleSignup} type="submit" disabled={mutate.isPending}/>
                    </div>
                </form>
               <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                    Create an account?{" "}
                    <Link href="/signup" className="text-blue-500 text-primary font-medium hover:underline">
                    Sign up</Link>
                </p>
               </div>
            </div>    
        </div>
    )
}