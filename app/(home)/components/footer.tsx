import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

export const Footer = () => {
  return (
     <div className="flex items-center max-md:justify-between w-full md:p-6 p-2 bg-background z-50">
      <Logo />

      <div className="md:ml-auto w-full justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  )
}