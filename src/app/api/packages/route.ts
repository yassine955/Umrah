import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get packages with related data
        const { data: packages, error } = await supabase
            .from('packages')
            .select(`
        *,
        flight_options (*),
        hotel_options (*),
        railway_options (*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching packages:", error)
            return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
        }

        return NextResponse.json(packages)
    } catch (error) {
        console.error("Error fetching packages:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { departure_city, departure_date, return_date, adults, children, total_price } = body

        // Create package
        const { data: packageData, error } = await supabase
            .from('packages')
            .insert({
                user_id: user.id,
                departure_city,
                departure_date: new Date(departure_date).toISOString(),
                return_date: new Date(return_date).toISOString(),
                adults: parseInt(adults),
                children: parseInt(children),
                total_price: parseFloat(total_price),
                status: "draft"
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating package:", error)
            return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
        }

        return NextResponse.json(packageData)
    } catch (error) {
        console.error("Error creating package:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}