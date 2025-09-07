import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { stripe, formatAmountForStripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { packageId } = await request.json()

        // Get package details
        const { data: packageData, error } = await supabase
            .from('packages')
            .select('*')
            .eq('id', packageId)
            .eq('user_id', user.id)
            .single()

        if (error || !packageData) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 })
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: formatAmountForStripe(packageData.total_price, 'EUR'),
            currency: 'EUR',
            metadata: {
                packageId: packageData.id,
                userId: user.id,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error("Error creating payment intent:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}