import { ChildProps } from "@/types"
import { Navbar } from "./components"

const HomeLayout = ({ children }: ChildProps) => {
  return (
    <div className="h-full" >
      <Navbar />
      <main className="h-full mt-24">
        {children}
      </main>
    </div>
  )
}

export default HomeLayout