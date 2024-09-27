import {atom,useAtom} from "jotai"

const modalState=atom(true)


export const useCreateChannelModal=()=>{
    return useAtom(modalState)
}