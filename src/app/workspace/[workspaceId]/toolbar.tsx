import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/components/ui/command"
import { useState } from "react"
import { UseGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetMembers } from "@/features/members/api/use-get-members"
import Link from "next/link"
import { useRouter } from "next/navigation"
  


export const Toolbar=()=>{

    const workspaceId=useWorkspaceId()
    const {data}=useGetWorkspace({id:workspaceId})
    const {data:channels}=UseGetChannels({workspaceId})
    const {data:members}=useGetMembers({workspaceId})

    const [open,setOpen]=useState(false)
    const router=useRouter()

    const onChannelClick=(channelId:string)=>{
        setOpen(false)

        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }
    const onMemberClick=(memberId:string)=>{
        setOpen(false)

        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }

    return(
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1"/>

            <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
                <Button onClick={()=>setOpen(true)} size="sm" className="bg-[#ABABAD] hover:bg-[#ABABAD]/80 hover:bg-accent-25 w-full justify-start h-7 px-2 ">
                    <Search className="size-4 text-black mr-2"/>
                    <span className="text-black text-xs font-normal">
                        Search {data?.name}
                    </span>
                </Button>
                <Command >

                    <CommandDialog open={open} onOpenChange={setOpen} >
                    <div className="bg-white">
                        <CommandInput placeholder="Type a command or search..."/>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Channels">
                                {channels?.map((channel)=>(
                                    <CommandItem key={channel._id} onSelect={()=>onChannelClick(channel._id)}>
                                        <Link href={`/workspace/${workspaceId}/channel/${channel._id}`}>
                                            {channel?.name}
                                        </Link>
                                    </CommandItem>
                                ))}

                            </CommandGroup>
                            <CommandSeparator/>
                            <CommandGroup heading="Members">
                                {members?.map((member)=>(
                                    <CommandItem key={member._id} onSelect={()=>onMemberClick(member._id)}>
                                        <Link href={`/workspace/${workspaceId}/member/${member._id}`}>
                                            {member?.user.name}
                                        </Link>
                                    </CommandItem>
                                ))}

                            </CommandGroup>
                        </CommandList>
                    </div>
                    </CommandDialog>

                </Command>

            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant="transparent" size="iconSm">
                    <Info className="size-5 text-white"/>
                </Button>
            </div>
        </nav>
    )
}