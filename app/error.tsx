"use client"

import Image from "next/image"
import Link from "next/link"

const Error = () => {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <Link href={"/"} className="text-center">
        <Image src={"/error.svg"} height={"300"} width={"300"} alt="Heroes" className="object-cover dark:hidden"/>
        <Image src={"/error-dark.svg"} height={"300"} width={"300"} alt="Heroes" className="object-cover hidden dark:block"/>
        <h2>Something went wrong</h2>
      </Link>
    </div>
  )
}

export default Error