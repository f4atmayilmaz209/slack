import { Button } from "@/components/ui/button"
import {Avatar,AvatarFallback,AvatarImage} from '@radix-ui/react-avatar'
import { Id } from "../../../../convex/_generated/dataModel";
import {cva,type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const userItemVariants=cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
    {
        variants:{
            variant:{
                default:"text-[#f9edffcc]",
                active:"text-black-400 bg-slate-100 hover:bg-white/90 rounded-xl"
            },
        },
        defaultVariants:{
            variant:"default"
        }

    },
)

interface UserItemProps{
    id:Id<"members">;
    label?:string;
    image?:string;
    variant?:VariantProps<typeof userItemVariants>["variant"];
}


export const UserItem=({
    id,
    label="Member",
    image,
    variant
}:UserItemProps)=>{

    const workspaceId=useWorkspaceId()
    const avatarFallback=label.charAt(0).toUpperCase()
    return(
      <Button
        variant="transparent"
        className={cn(userItemVariants({variant:variant}))}
        size="sm"
        asChild
      >
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
            <Avatar className="flex w-[20px] h-[20px] rounded-xs mr-1">               
                <AvatarImage className="rounded-xl w-[20px] h-[20px] object-fit" src={image}/>
                <AvatarFallback className="rounded-md bg-sky-500 text-white text-sm">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className="font-medium truncate text-sm">{label}</span>
        </Link>
      </Button>  
    )
}