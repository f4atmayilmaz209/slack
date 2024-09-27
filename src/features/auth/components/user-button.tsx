"use client"
import { useState } from "react";
import { useCurrentUser } from "../api/use-current-user";
import { Loader } from "lucide-react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

const UserButton = () => {
    const {signOut}=useAuthActions()
    const {data,isLoading}=useCurrentUser()
    const [isOpen, setIsOpen] = useState(false);

    if(isLoading){
        return <Loader className="size-4 animate-spin text-muted-foreground"/>
    }
    if(!data){
        return null
    }

    const {image,name,email}=data;
    const avatarFallback=name!.charAt(0).toUpperCase()
    console.log(image)

    return (
        <div className="flex gap-2 shrink-0">

            <Image className="rounded-full object-cover w-9 h-9 relative" src={image!} alt="" width={12} height={12} onClick={() => setIsOpen(!isOpen)}/>
            {isOpen && (
                <div className=" cursor-pointer absolute left-14 h-18 px-3 p-2  bg-white shadow-md flex items-center justify-center rounded-xl" onClick={()=>signOut()}>
                    <LogOut className="mr-2 size-5 text-black"/><span className="text-sm text-black w-16 cursor-pointer">Log Out</span>
                </div>

            )}

        </div>

    );
}

export default UserButton