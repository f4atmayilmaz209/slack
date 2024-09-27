import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogClose
  } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { CircleX, TrashIcon } from 'lucide-react';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/hooks/use-confirm';



interface PreferencesModalProps{
    open:boolean;
    setOpen:(open:boolean)=>void;
    initialValue:string
}

export const PreferencesModal=({
    open,
    setOpen,
    initialValue
}:PreferencesModalProps)=>{
    const router=useRouter()
    const workspaceId=useWorkspaceId()
    const [ConfirmDialog,confirm]=useConfirm(
        "Are you sure?",
        "This action is irreversible."
    )

    const [value,setValue]=useState(initialValue)
    const [editOpen,setEditOpen]=useState(false)
    const {mutate:updateWorkspace,isPending:isUpdatingWorkspace}=useUpdateWorkspace()
    const {mutate:removeWorkspace,isPending:isRemovingWorkspace}=useRemoveWorkspace()


    const handleRemove=async()=>{
        const ok=await confirm()

        if(!ok) return; 
        removeWorkspace({
            id:workspaceId
        },{
            onSuccess:()=>{
                toast.success("Workspace removed")
                router.replace("/")
            },
            onError:()=>{
                toast.error("Failed to remove workspace")
            }
        })
    }
    
    const handleEdit=(e:React.FormEvent<HTMLElement>)=>{
        e.preventDefault()



        updateWorkspace(
            {
                id:workspaceId,
                name:value
            },
            {
                onSuccess:()=>{
                    setEditOpen(false)
                    toast.success("Workspace updated")

                },
                onError:()=>{
                    toast.error("Failed to update workspace")
                }
            }
    )
    }

    return(
        <>
        <ConfirmDialog/>



        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="shadow-2xl absolute bg-white w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[2px] border-pink-300 px-10 py-2 border-radius rounded-xl">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="bg-white flex flex-col gap-y-4 pl-5 mt-10 relative">


                                    <div className='flex flex-col'>
                                        <div className='bg-white flex items-center justify-between'>
                                            <p className='text-sm font-semibold'>Workspace name:</p>
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>

                                        </div>
                                        <p className='text-sm'>
                                            {value}
                                        </p>
                                    </div>
    
                                </div>
                            </DialogTrigger>
                            <button disabled={isRemovingWorkspace} onClick={handleRemove}
                                className='bg-white flex items-center gap-x-2 py-4 rounded-lg cursor-pointer mt-2 px-4'    
                            >
                                <TrashIcon className='size-4 text-rose-500'/>
                                <p className="text-sm font-medium text-rose-500 ">Delete workspace</p>
                            </button>
                            <DialogContent className=' absolute top-3 p-5 w-[368px] bg-rose-100 '>
                                <DialogTitle>
                                    Rename this workspace
                                </DialogTitle>
                                <form className='space-y-4 mt-2' onSubmit={handleEdit}>
                                    <Input
                                        value={value}
                                        disabled={isUpdatingWorkspace}
                                        onChange={(e)=>setValue(e.target.value)}
                                        required 
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="Workspace name e.g 'Work', 'Personal','Home'"
                                        className='border-[2px] border-radius border-black'
                                    
                                    />
                                    <DialogClose asChild>
                                        <Button variant="outline" disabled={isUpdatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingWorkspace}>Save</Button>

                                </form>
                                <DialogClose className="absolute top-1 right-2">
                                    <CircleX/>
                                </DialogClose>


                            </DialogContent>


                        </Dialog>

                        <DialogClose >
                            <CircleX className="text-pink-400 right-2 top-2 absolute"/>
                        </DialogClose>
            </DialogContent>

        </Dialog>

        </>
    )
}