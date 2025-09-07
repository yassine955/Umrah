import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase-server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error("Webhook signature verification failed:", err)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    try {
        const supabase = createClient()

        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                const { packageId, userId } = paymentIntent.metadata

                // Create booking record
                const { error: bookingError } = await supabase
                    .from('bookings')
                    .insert({
                        package_id: packageId,
                        user_id: userId,
                        status: "confirmed",
                        total_amount: paymentIntent.amount / 100, // Convert from cents
                        currency: paymentIntent.currency.toUpperCase(),
                        payment_status: "paid",
                        stripe_payment_intent_id: paymentIntent.id,
                        confirmation_number: `UMR-${Date.now()}`,
                    })

                if (bookingError) {
                    console.error("Error creating booking:", bookingError)
                    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
                }

                // Update package status
                const { error: packageError } = await supabase
                    .from('packages')
                    .update({ status: "booked" })
                    .eq('id', packageId)

                if (packageError) {
                    console.error("Error updating package:", packageError)
                }

                break

            case "payment_intent.payment_failed":
                const failedPayment = event.data.object as Stripe.PaymentIntent
                const { packageId: failedPackageId } = failedPayment.metadata

                // Update package status to indicate payment failed
                const { error: updateError } = await supabase
                    .from('packages')
                    .update({ status: "draft" })
                    .eq('id', failedPackageId)

                if (updateError) {
                    console.error("Error updating package status:", updateError)
                }

                break

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Error processing webhook:", error)
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
    }
}