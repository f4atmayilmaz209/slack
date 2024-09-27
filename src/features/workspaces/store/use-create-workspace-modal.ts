import {atom,useAtom} from "jotai"

const modalState=atom(true)


export const useCreateWorkspaceModal=()=>{
    return useAtom(modalState)
}