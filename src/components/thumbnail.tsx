/*eslint-disable @next/next/no-img-element*/
import { 
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@radix-ui/react-dialog";
import {XIcon} from "lucide-react"
import Image from "next/image";

interface ThumbnailProps{
    url:string | null | undefined;
}


export const Thumbnail=({url}:ThumbnailProps)=>{
    console.log("image")
    console.log(url)
    console.log("maci")
    if(!url) return null;

    return(
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] h-[400px] border rounded-lg my-2 cursor-zoom-in">
                    <img 
                        src={url}
                        alt="Message image"
                        className="rounded-md object-cover size-full"
                    
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
                <img 
                    src={url}
                    alt="Message image"
                    className="rounded-md object-cover size-full"
                
                />
            </DialogContent>
        </Dialog>
    )
}