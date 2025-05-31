import { ChildProps } from "@/types"

const Layout = ({ children }: ChildProps) => {
  return (
    <div className="w-full">{children}</div>
  )
}

export default Layout