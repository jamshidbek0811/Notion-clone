"use client"

import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, Rocket, Search, Settings, Trash } from "lucide-react"
import React, { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { DocumentList } from "./document-list"
import { Item } from "./item"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { UserBox } from "./user-box"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import TrashBox from "./trash-box"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const Sidebar = () => {
    const router = useRouter()
    const isMobile = useMediaQuery("(max-width: 700px)")

    const createDocument = useMutation(api.document.createDocument)

    const sideBarRef = useRef<ElementRef<"div">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)
    const isResizing = useRef(false)

    const [isCollapsed, setIsCollapsed] = useState(isMobile)
    const [isResseting, setisResseting] = useState(false)

    useEffect(() => { 
        if(isMobile){
            collapse()
        }else {
            reset()
        }
    },[isMobile])

    const collapse = () => {
        if(sideBarRef.current && navbarRef.current){
            setIsCollapsed(true)
            setisResseting(true)
            sideBarRef.current.style.width = "0"
            navbarRef.current.style.width = "100%"
            navbarRef.current.style.left = "0"
        }
        setTimeout(() => setisResseting(false), 300)
    }

    const reset = () => {
        if(sideBarRef.current && navbarRef.current){
            setIsCollapsed(false)
            setisResseting(true)
            sideBarRef.current.style.width = isMobile ? "100%" : "288px"
            navbarRef.current.style.width = isMobile ? "0" :"calc(100% - 288px)"
            navbarRef.current.style.left = isMobile ? "100%" :"288px"
        }
        setTimeout(() => setisResseting(false), 300)
    }

    const handleMauseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()

        isResizing.current = true
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizing.current) return 

        let newWidht = event.clientX
        if(newWidht < 288) newWidht = 288
        if(newWidht > 400) newWidht = 400

        if(navbarRef.current && sideBarRef.current){
            sideBarRef.current.style.width = `${newWidht}px`
            navbarRef.current.style.left = `${newWidht}px`
            navbarRef.current.style.width = `calc(100% - ${newWidht}px)`
        }
    }

    const handleMouseUp = () => {
        isResizing.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const onCreateDocument = () => {
        const promise = createDocument({ title: "Untitle" }).then(res => router.push(`/documents/${res}`))
        toast.promise(promise, {
            loading: "Creating a new document..",
            success: "Created succes document!",
            error: "Failed to create new document!"
        })
    }

    const arr = [1]
  return (
    <>
        <div ref={sideBarRef} className={cn("h-screen group bg-secondary overflow-y-auto relative flex w-72 flex-col z-50", isResseting && "transition-all ease-in duration-300", isMobile && "w-0")}>
            <div role="button" className={cn("md:h-8 h-6 md:w-8 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition", isMobile && "opacity-100")} onClick={collapse}>
                <ChevronsLeft className="md:h-8 h-6 md:w-8 w-6"/>
            </div>

            <div className="py-2 px-0 flex flex-col gap-1">
                <UserBox />
                <Item label="Search" icon={Search}/>
                <Item label="Settings" icon={Settings}/>
                <Item label="New Document" icon={Plus} onClick={onCreateDocument}/>
            </div>
            <div className="mt-4">
                <DocumentList />
                <Item label="Add a page" icon={Plus} onClick={onCreateDocument}/>

                <Popover>
                    <PopoverTrigger className="w-full mt-4">
                        <Item label="Trash" icon={Trash}/>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-72" side={isMobile ? "bottom" : "right"}>
                        <TrashBox />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="absolute right-0 top-0 w-1 h-full cursor-e-resize bg-primary/10 opacity-0 group-hover:opacity-100 transition" onMouseDown={handleMauseDown}/>

            <div className="absolute bottom-0 px-2 bg-white/50 dark:bg-black/50 py-4 w-full">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[13px]">
                        <Rocket />
                        <p className="opacity-70 font-bold">Free plan</p>
                    </div>

                    <p className="text-[13px] opacity-70">{arr.length}/3</p>
                </div>

                <Progress className="mt-2" value={arr.length >= 3 ? 100 : arr.length * 33.33} />
            </div>
        </div>

        <div className={cn("absolute top-0 z-50 left-72 w-[calc(100% - 288px)]", isResseting && "transition-all ease-in duration-400", isMobile && "w-full left-0")} ref={navbarRef}>
            <nav className="bg-transparent px-3 py-2 w-full">
                {isCollapsed && (
                    <MenuIcon className="h-8 w-8 text-muted-foreground cursor-pointer" role="button" onClick={reset}/>
                )}
            </nav>
        </div>
    </>
  )
}