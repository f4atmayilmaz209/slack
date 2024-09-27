import { Button } from "@/components/ui/button";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@radix-ui/react-dialog"
import { CircleX, CopyIcon, RefreshCcwIcon } from "lucide-react";
import {toast} from "sonner"

interface InviteModalProps{
    open:boolean;
    setOpen:(open:boolean)=>void;
    name:string;
    joinCode:string;

}

const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode
}:InviteModalProps) => {
    const workspaceId=useWorkspaceId()
    const [ConfirmDialog,confirm]=useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new code."
    )

    const {mutate,isPending}=useNewJoinCode()
    const handleNewCode=async()=>{
        const ok=await confirm()
        if(!ok) return

        mutate(
            {
            workspaceId
            },{
            onSuccess:()=>{
                toast.success("Invite code regenerated")
            },
            onError:()=>{
                toast.error("Failed to regenerate invite code")
            }
        }
        )
    }

    const handleCopy=()=>{
        const inviteLink=`${window.location.origin}/join/${workspaceId}`
        navigator.clipboard
            .writeText(inviteLink)
            .then(()=>toast.success("Invite link copied to clipboard"))
    }
  return (
    <>
    <ConfirmDialog />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="shadow-2xl w-45 absolute bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[2px] border-pink-300 px-10 py-2 border-radius rounded-xl">
        <DialogTitle className="font-medium text-md mt-6">
            Invite people to {name}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-300 font-medium">
            Use the code below to invite people to your workspace
        </DialogDescription>
        <div className="flex flex-col gap-y-4 items-center justify-center py-8">
            <p className="text-4xl font-bold tracking-widest uppercase">{joinCode}</p>
        </div>
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
        >
            Copy link 
            <CopyIcon className="size-4 ml-2"/>
        </Button>
        <div className="flex items-center justify-between w-full">
            <Button disabled={isPending} onClick={handleNewCode} variant="outline">
                New code
                <RefreshCcwIcon className="size-4 ml-2 "/>
            </Button>   
            <DialogClose asChild>
                <Button >Close</Button>
             </DialogClose>
        </div>
        <DialogClose >
            <CircleX className="text-pink-400 right-2 top-2 absolute"/>
        </DialogClose>

       </DialogContent> 
    </Dialog>
    </>
  )
}

export default InviteModal
