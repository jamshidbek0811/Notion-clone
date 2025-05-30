import { ReactNode } from "react"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useTheme } from "next-themes"

interface IconPickerProps {
    onChange: (icon: string) => void
    children: ReactNode
    asChild?: boolean
}

const IconPicker = ({ children, asChild, onChange }: IconPickerProps) => {
    const { resolvedTheme } = useTheme() 
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap

    const themeMap = { 
        dark: Theme.DARK,
        light: Theme.LIGHT
    }

    const theme = themeMap[currentTheme]
    
  return (
    <Popover>
        <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
        <PopoverContent>
            <EmojiPicker height={350} theme={theme} onEmojiClick={data => onChange(data.emoji)}/>
        </PopoverContent>
    </Popover>
  )
}

export default IconPicker