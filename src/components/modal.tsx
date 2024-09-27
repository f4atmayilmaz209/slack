"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useEffect, useState } from "react"
import { CreateChannelModal } from "@/features/channels/components/create-channel-modal"
import { Authenticated, Unauthenticated } from "convex/react";
export const Modals=()=>{
    const [mounted,setMounted]=useState(false)


    useEffect(()=>{
        setMounted(true)
    },[])

    if(!mounted) return null

    return(
        <>
            <Authenticated>
                <CreateChannelModal/>
                <CreateWorkspaceModal/>
            </Authenticated>

        </>
    )
}