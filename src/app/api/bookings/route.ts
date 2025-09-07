import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select(`
        *,
        packages (
          id,
          departure_city,
          departure_date,
          return_date,
          adults,
          children
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching bookings:", error)
            return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
        }

        return NextResponse.json(bookings)
    } catch (error) {
        console.error("Error fetching bookings:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
