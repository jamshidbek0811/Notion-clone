"use client"

import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { SignInButton, useUser } from "@clerk/clerk-react"
import axios from "axios"
import { useConvexAuth } from "convex/react"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface PricingCardProps {
  title: string
  subtitle: string
  options: string
  price: string
  priceId?: string
}

export const PricingCard = ({ title, subtitle, priceId, price, options }: PricingCardProps) => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const { user } = useUser()
    const router = useRouter()
    const [isSubmiting, setIsSubmiting] = useState(false)

    const onSubmit = async () => {
      if(price === "Free"){
        router.push("/documents")
        return
      }
      setIsSubmiting(true)
      try {
        const { data } = await axios.post("/api/stripe/subscription", {
          priceId,
          email: user?.emailAddresses[0].emailAddress,
          userId: user?.id
        })
        window.open(data, "_self")
      } catch (error) {
          toast.error("Something went wrong. Please try again later!")
      }finally {
        setIsSubmiting(false)
      }
    }
    return (
      <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-black dark:text-white">
        <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
          {subtitle}
        </p>

        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">
            {price !== "Free" && "$"}
            {price}
          </span>
          <span className="text-gray-500 dark:text-gray-400">/month</span>
        </div>

        {isLoading && (
          <div className="w-full flex justify-center items-center">
            <Loader />
          </div>
        )}

        {isAuthenticated && !isLoading && (
          <Button onClick={onSubmit} disabled={isSubmiting}>
            {isSubmiting ? (
              <>
                <Loader />
                <span className="ml-2">Submiting..</span>
              </>
            ) : (
              "Get Started"
            )}</Button>
        )}

        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button>Log In</Button>
          </SignInButton>
        )}

        <ul role="list" className="space-y-4 text-left mt-8">
          {options.split(", ").map((option) => (
            <li key={option} className="flex items-center space-x-3">
              <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
              <span>{option}</span>
            </li>
          ))}
        </ul>
      </div>
    )
}