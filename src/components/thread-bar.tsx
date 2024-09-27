import {Avatar,AvatarFallback,AvatarImage} from "@radix-ui/react-avatar"
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";


interface ThreadBarProps{
    count?:number;
    image?:string;
    timestamp?:number;
    name?:string;
    onClick?:()=>void;
}

export const ThreadBar=({
    count,
    image,
    name="Member",
    timestamp,
    onClick
}:ThreadBarProps)=>{

    const avatarFallback=name.charAt(0).toUpperCase()
    if(!count || !timestamp) return null;


    return(
        <button 
            onClick={onClick}
            className=" rounded-xl hover:bg-white border border-transparent  flex items-center justify-start group/thread-bar transition max-w-[600px]"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="rounded-full shrink-0">
                    <AvatarImage className="rounded-xl h-9 w-10 size-5 object-cover" src={image}/>
                    <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-sky-700 hover:underline font-bold truncate">
                    {count} {count > 1 ? "replies" : "reply"}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Last reply {formatDistanceToNow(timestamp,{addSuffix:true})}
                </span>    
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
                    View thread
                </span>
            </div>  
            <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0"/>  
        </button>
    )

}