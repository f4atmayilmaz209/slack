import { Button } from '@/components/ui/button';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuArrow,
  } from '@radix-ui/react-dropdown-menu';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';


export const WorkspaceSwitcher=()=>{

    const router=useRouter()
    const workspaceId=useWorkspaceId()
    const [_open,setOpen]=useCreateWorkspaceModal()
    const {data:workspace,isLoading:workspaceLoading}=useGetWorkspace({id:workspaceId})
    const {data:workspaces,isLoading:workspacesLoading}=useGetWorkspaces()

    const filteredWorkspaces=workspaces?.filter(
        (workspace)=>workspace?._id !==workspaceId
    )

    

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl rounded-xl'>
                    {workspaceLoading ? (
                        <Loader className='size-5 animate-spin shrink-0'/>
                    ) :(
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
            <DropdownMenuContent side="bottom" align="start" className='flex flex-col truncate overflow-hidden  w-[270px] focus:ring-0 focus:ring-offset-0 bg-white p-1 rounded-xl'>
                <DropdownMenuItem
                    onClick={()=>router.push(`/workspace/${workspaceId}`)}
                    className='truncate overflow-hidden hover:bg-slate-100 focus:ring-0 p-2 pl-2 gap-1 h-15 w-25 flex cursor-pointer flex-col justify-center items-start capitalize'
                >
                    <span className='font-medium'>{workspace?.name}</span>
                    <span className=' text-muted-foreground text-slate-500 text-sm'>
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {filteredWorkspaces?.map((workspace:any)=>(
                    <DropdownMenuItem onClick={()=>router.push(`/workspace/${workspace._id}`)} key={workspace._id} className='relative flex flex-row items-center gap-2 pl-2.5 cursor-pointer capitalize hover:bg-slate-100 overflow-hidden truncate'>
                        <div className="shrink-0 flex mb-2 items-center justify-center rounded-xl size-9  overflow-hidden bg-[#616061] text-white font-semibold">
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='absolute left-[49px] bottom-4'>{workspace.name}</div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={()=>setOpen(true)} className="hover:bg-slate-200 cursor-pointer p-2 pl-2 flex items-center justify-start h-10">
                    <div className="flex items-center justify-center mr-2 text-lg rounded-md size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold">
                        <Plus/>
                    </div>
                    Create a new workspace
                </DropdownMenuItem>

            </DropdownMenuContent>
            </DropdownMenuPortal>
      </DropdownMenu>
    )
}