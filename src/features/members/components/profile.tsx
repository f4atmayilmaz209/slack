import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";



interface ProfileProps{
    memberId:Id<"members">;
    onClose:()=>void;

}


export const Profile=({memberId,onClose}:ProfileProps)=>{

    const router=useRouter()
    const workspaceId=useWorkspaceId()

    const [UpdateDialog,confirmUpdate]=useConfirm(
        "Change role",
        "Are you sure you want to change this member's role?"
    )
    const [LeaveDialog,confirmLeave]=useConfirm(
        "Leave workspace",
        "Are you sure you want to leave this workspace?"
    )
    const [RemoveDialog,confirmRemove]=useConfirm(
        "Remove member",
        "Are you sure you want to remove this member?"
    )

    const {data:currentMember,isLoading:isLoadingCurrentMember}=useCurrentMember({
        workspaceId
    })
    const {data:member,isLoading:isLoadingMember}=useGetMember({id:memberId})
    const {mutate:updateMember,isPending:isUpdatingMember}=useUpdateMember();
    const {mutate:removeMember,isPending:isRemovingMember}=useRemoveMember()

    const onRemove=async()=>{
        const ok=await confirmRemove()
        if(!ok) return;
        removeMember({id:memberId},{
            onSuccess:()=>{
                router.replace("/")
                toast.success("Member removed")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to remove member")
            }
        })
    }
    const onLeave=async()=>{
        const ok=await confirmLeave()
        if(!ok) return;
        removeMember({id:memberId},{
            onSuccess:()=>{
                toast.success("You left the workspace")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to leave the workspace")
            }
        })
    }
    const onUpdate=async(role:"admin" | "member")=>{
        const ok=await confirmLeave()
        if(!ok) return;
        updateMember({id:memberId,role},{
            onSuccess:()=>{
                toast.success("Role changed")
                onClose()
            },
            onError:()=>{
                toast.error("Failed to change role")
            }
        })
    }
    
    if(isLoadingMember || isLoadingCurrentMember){
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div> 
            </div>
        )
    }

    if(!member){
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">Profile not found</p>
                </div> 
            </div>
        )
    }

    const avatarFallback=member.user.name?.[0] ?? "M";


    return(
        <>
        <RemoveDialog/>
        <LeaveDialog/>
        <UpdateDialog/>
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">Profile</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                    <XIcon className="size-5 stroke-[1.5]"/>
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center">
                <Avatar className="">
                    <AvatarImage src={member?.user?.image} className="size-40 mt-4 rounded-3xl"/>
                    <AvatarFallback className=" bg-blue-500 ">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div> 
            <div className="flex flex-col p-4">
                <p className="text-xl font-bold">{member.user.name}</p>
                {currentMember?.role==="admin" &&
                    currentMember?._id!==memberId ? (
                        <div className="flex items-center gap-2 mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                <Button variant="outline" className="w-full capitalize">
                                    {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="p-2 w-full bg-slate-300 rounded-xl">
                                    <DropdownMenuRadioGroup
                                        value={member.role}
                                        onValueChange={(role)=>onUpdate(role as "admin" | "member")}
                                    >
                                        <DropdownMenuRadioItem 
                                            value="admin"
                                        >
                                            Admin
                                        </DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem 
                                            value="member"
                                        >
                                            Member
                                        </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={onRemove} variant="outline" className="w-full capitalize">
                                Remove
                            </Button>
                        </div> 
                    ):currentMember?._id===memberId && 
                        currentMember?.role!=="admin" ? (
                            <div>
                                <Button onClick={onLeave}>
                                    Leave
                                </Button>
                            </div>
                        ):null
                }
            </div>
            <Separator className="bg-slate-300 h-[1px]"/>
            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">Contact Information</p>
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                        <MailIcon className="size-4"/>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[13px] font-semibold text-muted-foreground">
                            Email Address
                        </p>
                        <Link
                            href={`mailto:${member.user.email}`}
                            className="text-sm hover:underline text-[#1264a3]"
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}