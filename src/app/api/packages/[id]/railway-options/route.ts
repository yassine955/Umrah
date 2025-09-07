import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Verify package belongs to user
        const { data: packageData, error: packageError } = await supabase
            .from('packages')
            .select('id')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (packageError || !packageData) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 })
        }

        const body = await request.json()

        const { data: railwayOption, error } = await supabase
            .from('railway_options')
            .insert({
                package_id: params.id,
                ...body
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating railway option:", error)
            return NextResponse.json({ error: "Failed to create railway option" }, { status: 500 })
        }

        return NextResponse.json(railwayOption)
    } catch (error) {
        console.error("Error creating railway option:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
