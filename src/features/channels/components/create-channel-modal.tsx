import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@radix-ui/react-dialog"
import { useCreateChannelModal } from "../store/use-create-channel-modal"
import { CircleX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCreateChannel } from "../api/use-create-channel"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CreateChannelModal=()=>{
    const router=useRouter()
    const workspaceId=useWorkspaceId()
    const [open,setOpen]=useCreateChannelModal()
    const {mutate,isPending}=useCreateChannel()
    const [name,setName]=useState("")

    const handleClose=()=>{
        setName("")
        setOpen(false)
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value=e.target.value.replace(/\s+/g,"-").toLowerCase();
        setName(value)

    }
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        mutate(
            {name,workspaceId},
            {
                onSuccess:(id)=>{
                    toast.success("Channel created")
                    router.push(`/workspace/${workspaceId}/channel/${id}`)
                    handleClose()
                },
                onError:()=>{ 
                    toast.error("Failed to create channel")
                }

            }
        )
    }

    return(
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="shadow-2xl w-45 absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[2px] border-pink-300 px-8 py-2 border-radius rounded-xl">
                <DialogTitle className="font-medium text-md">
                    Add a channel?
                </DialogTitle>
                <DialogClose >
                    <CircleX className="text-pink-400 right-2 top-2 absolute"/>
                </DialogClose>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required 
                        autoFocus 
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                        className="rounded-xl w-[300px] border-[2px] border-gray-700"
                    
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} className="border-[2px] border-gray-700 rounded-xl h-10 w-18">Create</Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}