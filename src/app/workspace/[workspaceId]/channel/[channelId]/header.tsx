import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-members";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { CircleX, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps{
    title:string;
}

export const Header=({title}:HeaderProps)=>{
    

    const [editOpen,setEditOpen]=useState(false)
    const [value,setValue]=useState(title)
    const channelId=useChannelId()
    const router=useRouter()
    const [ConfirmDialog,confirm]=useConfirm(
        "Delete this channel?",
        "You are about to delete this channel.This action is irreversible"
    )
    const workspaceId=useWorkspaceId()
    const {data:member}=useCurrentMember({workspaceId})
    const {mutate:updateChannel,isPending:updatingChannel}=useUpdateChannel()
    const {mutate:removeChannel,isPending:isRemovingWorkspace}=useRemoveChannel()

    const handleEditOpen=(value:boolean)=>{
        if(member?.role!=="admin") return 
        setEditOpen(value)
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value.replace(/\s+/g,"-").toLowerCase();
        setValue(value)

    }
    const handleRemove=async()=>{
        const ok=await confirm()

        if(!ok) return; 
        removeChannel({
            id:channelId
        },{
            onSuccess:()=>{
                toast.success("Channel deleted")
                router.push(`/workspace/${workspaceId}`)
            },
            onError:()=>{
                toast.error("Failed to delete channel")
            }
        })
    }
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        updateChannel({id:channelId,name:value},{
            onSuccess:()=>{
                toast.success("Channel updated")
                setEditOpen(false)
            },
            onError:()=>{
                toast.error("Failed to update channel")
            }
        })
    }
    return(
        <>
        <ConfirmDialog/>

        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-lg font-semibold px-2 overflow-hidden w-auto"
                  size="sm"
                >
                   <span className="trucate"># {title}</span>
                   <FaChevronDown className="size-2.5 ml-2"/>
                </Button>
                </DialogTrigger>
                <DialogContent className=" w-[400px] shadow-lg rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-0 bg-gray-50 overflow-hidden">
                       <DialogTitle className="p-4 border-b bg-white font-semibold">
                          # {title}
                       </DialogTitle>
                       <div className="px-4 pb-4 flex flex-col gap-y-2">
                          <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
  
                          <div className="px-5 py-4 mt-2 bg-white rounded-xl border cursor-pointer hover:bg-gray-100">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">Channel name</p>  
                                {member?.role==="admin" && (
                                   <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                )}
                            </div>
                            <p className="text-sm"># {title}</p>
                          </div>
                          </DialogTrigger>  
                          <DialogContent className=' absolute top-3 p-5 w-[368px] bg-rose-100 '>
                                <DialogTitle>
                                    Rename this channel
                                </DialogTitle>
                                <form className='space-y-4 mt-2' onSubmit={handleSubmit}>
                                    <Input
                                        value={value}
                                        disabled={updatingChannel}
                                        onChange={handleChange}
                                        required 
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="Workspace name e.g 'Work', 'Personal','Home'"
                                        className='border-[2px] border-radius border-black'
                                    
                                    />
                                    <DialogClose asChild>
                                        <Button variant="outline" disabled={updatingChannel}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={updatingChannel}>Save</Button>

                                </form>
                                <DialogClose className="absolute top-1 right-2">
                                    <CircleX/>
                                </DialogClose>


                            </DialogContent>

                          </Dialog>
                          {member?.role==="admin" && (
                          <button
                            disabled={isRemovingWorkspace} onClick={handleRemove}
                            className=" text-rose-600 border hover:bg-gray-50 flex items-center gap-x-2 px-5 py-4 bg-white rounded-xl cursor-pointer"
                          >
                            <TrashIcon className="size-4"/>
                            <p className="text-sm font-semibold">Delete channel</p>
                          </button>
                          )}
                       </div>
                       <DialogClose className="absolute top-1 right-2 text-gray-700">
                          <CircleX/>
                        </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
        </>
    )
    }