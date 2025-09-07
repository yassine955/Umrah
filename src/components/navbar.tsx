"use client"

import { useSupabase } from "@/components/providers"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plane, User, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
    const { user, loading } = useSupabase()
    const router = useRouter()
    // Use the imported supabase client

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('Error signing out:', error)
                return
            }
            // Force a page reload to ensure clean state
            window.location.href = '/'
        } catch (error) {
            console.error('Unexpected error during sign out:', error)
        }
    }

    return (
        <nav className="border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Plane className="h-8 w-8 text-green-600" />
                            <span className="text-xl font-bold text-foreground">Umrah Dashboard</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {loading ? (
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.user_metadata?.full_name || ""} />
                                            <AvatarFallback>
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user.user_metadata?.full_name || user.email}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={handleSignOut}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link href="/auth/signin">Sign In</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/auth/signup">Get Started</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}