import { useEffect, useState } from "react"

export const UseScrolled = () => {
    const [scroll, setScroll] = useState(false)
    useEffect(() => {
        const handlerScroll = () => {
            if(window.scrollY > 10){
                setScroll(true)
            }else {
                setScroll(false)
            }
        }

        window.addEventListener("scroll", handlerScroll)
        return () => window.removeEventListener("scroll", handlerScroll)
    },[])
    return scroll
}
