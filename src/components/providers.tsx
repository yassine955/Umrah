"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from './theme-provider'

const SupabaseContext = createContext<{
    user: User | null
    session: Session | null
    loading: boolean
}>({
    user: null,
    session: null,
    loading: true
})

export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    if (!context) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return context
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    // Use the imported supabase client

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email)
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    return (
        <ThemeProvider defaultTheme="system" storageKey="umrah-theme">
            <QueryClientProvider client={queryClient}>
                <SupabaseContext.Provider value={{ user, session, loading }}>
                    {children}
                </SupabaseContext.Provider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}