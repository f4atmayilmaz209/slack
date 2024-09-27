
import { useState } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { FaWindowClose } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import {toast} from "sonner"


export const CreateWorkspaceModal=()=>{

    const router=useRouter()
    const [open,setOpen]=useCreateWorkspaceModal()
    const [name,setName]=useState("")
    const {mutate,isPending}=useCreateWorkspace()

    const handleClose=()=>{
        setOpen(!open)
        setName("")
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        mutate({name},{
            onSuccess(id){
                toast.success("Workspace created")
                router.push(`/workspace/${id}`)
                handleClose()
            }
        })


    }
    const Form=()=>{
        return <>
                <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6 items-center justify-center">
                    <span className="text-center font-medium text-neutral-600">Add a workspace</span>
                    <Input
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        className="w-[40%] md:w-[80%] lg:w-[80%] xl:w-[70%] 2xl:w-[80%] rounded-full text-xs border-[2px] border-neutral-400"
                        disabled={isPending}
                        required 
                        autoFocus 
                        minLength={3}
                        placeholder=" Workspace name e.g. 'Work','Personal','Home'"
                    
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} className="bg-neutral-400 border-[2px] border-neutral-600 text-gray-800">
                            Create
                        </Button>
                    </div>
                </form>
            </>

    }


    return (
        <>
        {open && (
            <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
                <div className="bg-rose-50 p-4 rounded-md relative w-[50%] md:w-[60%] lg:w-[40%] xl:w-[40%] 2xl:w-[30%] h-[200px]">
                    <Form/>
                    <div className="absolute top-4 right-4 cursor-pointer " onClick={()=>handleClose()}>
                        <FaWindowClose/>
                    </div>
                </div>
            </div>

        )}
        </>

    )
}