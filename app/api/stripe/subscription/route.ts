import stripe from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const public_domain = process.env.NEXT_PUBLIC_DOMAIN
        const { email, userId, priceId } = await req.json()

        let customer
        const isExistingCustomer = await stripe.customers.list({ email })
        if(isExistingCustomer.data.length){
            customer = isExistingCustomer.data[0]
        }

        if(!customer){
            customer = await stripe.customers.create({
                email,
                metadata: { userId }
            })
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id
        })

        const isSubscription = subscriptions.data.find(sub => sub.status === "active")
        if(!isSubscription){
            const subscription = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [{ price: priceId, quantity: 1 }],
                customer: customer.id,
                success_url: `${public_domain}/documents`,
                cancel_url: `${public_domain}`
            })
            return NextResponse.json(subscription.url)
        }else {
            const portal = await stripe.billingPortal.sessions.create({
                customer: customer.id,
                return_url: `${public_domain}/documents`
            })
            return NextResponse.json(portal.url)
        }
    } catch (error) {
        return NextResponse.json(`Something went wrong! - ${error}`, { status: 400 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const email = searchParams.get("email")
        const customer = await stripe.customers.list({ email: email! })

        if(!customer.data.length) return NextResponse.json("Free")            
        
        const subscription: any = await stripe.subscriptions.list({
            customer: customer.data[0].id,
            expand: ["data.plan.product"]
        })

        if(!subscription.data.length) return NextResponse.json("Free")   

        return NextResponse.json(subscription.data[0].plan.product.name) 
    } catch (error) {
        return NextResponse.json("Something went worng! Please try again later!")
    }
}