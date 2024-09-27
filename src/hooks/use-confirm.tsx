import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export const useConfirm=(
    title:string,
    message:string
):[()=>JSX.Element,()=>Promise<unknown>]=>{

    const [promise,setPromise]=useState<{resolve:(value:boolean)=>void} | null>(null)

    const confirm=()=>new Promise((resolve,reject)=>{
        setPromise({resolve})
    })

    const handleClose=()=>{
        setPromise(null)
    }

    const handleCancel=()=>{
        promise?.resolve(false)
        handleClose()
    }
    const handleConfirm=()=>{
        promise?.resolve(true)
        handleClose()
    }
    const ConfirmDialog=()=>(
        <div className={`absolute top-[60%] right-[10%] -translate-x-1/2 translate-y-3/4  p-3  rounded-xl ${promise!==null ? "border-black border-[1px] shadow-lg" :""}`}>


            <Dialog open={promise!==null}>
                <DialogContent>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        >Cancel</Button>
                    <Button
                        onClick={handleConfirm}>
                            Confirm
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    
    )
    return [ConfirmDialog,confirm]
}