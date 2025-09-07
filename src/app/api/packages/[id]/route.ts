import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: packageData, error } = await supabase
            .from('packages')
            .select(`
        *,
        flight_options (*),
        hotel_options (*),
        railway_options (*)
      `)
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (error || !packageData) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 })
        }

        return NextResponse.json(packageData)
    } catch (error) {
        console.error("Error fetching package:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()

        const { data: packageData, error } = await supabase
            .from('packages')
            .update({
                ...body,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error("Error updating package:", error)
            return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
        }

        return NextResponse.json(packageData)
    } catch (error) {
        console.error("Error updating package:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { error } = await supabase
            .from('packages')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            console.error("Error deleting package:", error)
            return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting package:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
