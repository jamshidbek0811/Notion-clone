import { ModeToggle } from "@/components/shared/mode-toggle"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"

export const Navbar = () => {
  return (
    <div className="z-50 bg-background fixed top-0 flex items-center w-full p-6 justify-between">
        <Logo />
        <div className="flex items-center gap-x-2">
          <Button size={"sm"} variant={"ghost"}>Log in</Button>
          <Button size={"sm"} >Get Notion Free</Button>
          <ModeToggle />
        </div>
    </div>
  )
}