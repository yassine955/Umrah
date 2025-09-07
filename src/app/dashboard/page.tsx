"use client"

import { useSupabase } from "@/components/providers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Plane, Hotel, Train, Calendar, MapPin, Users, Euro } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockPackages = [
    {
        id: "1",
        departure_city: "Amsterdam",
        departure_date: "2024-03-15",
        return_date: "2024-03-25",
        adults: 2,
        children: 1,
        total_price: 2450.00,
        status: "draft",
        created_at: "2024-01-15"
    },
    {
        id: "2",
        departure_city: "Brussels",
        departure_date: "2024-04-10",
        return_date: "2024-04-20",
        adults: 1,
        children: 0,
        total_price: 1890.00,
        status: "booked",
        created_at: "2024-01-10"
    }
]

const mockBookings = [
    {
        id: "1",
        package_id: "2",
        status: "confirmed",
        total_amount: 1890.00,
        payment_status: "paid",
        confirmation_number: "UMR-2024-001",
        created_at: "2024-01-10"
    }
]

export default function DashboardPage() {
    const { user, loading } = useSupabase()
    const router = useRouter()
    const [packages, setPackages] = useState(mockPackages)
    const [bookings, setBookings] = useState(mockBookings)

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/signin")
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: "secondary",
            active: "default",
            booked: "default",
            confirmed: "default",
            cancelled: "destructive"
        } as const

        return (
            <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    const getPaymentStatusBadge = (status: string) => {
        const variants = {
            pending: "secondary",
            paid: "default",
            failed: "destructive",
            refunded: "outline"
        } as const

        return (
            <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {user.user_metadata?.full_name || user.email}! Manage your Umrah packages and bookings.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                            <Plane className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{packages.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {packages.filter(p => p.status === 'draft').length} drafts
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</div>
                            <p className="text-xs text-muted-foreground">
                                {bookings.filter(b => b.payment_status === 'paid').length} paid
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <Euro className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                €{bookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All time
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Savings</CardTitle>
                            <Euro className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                €{Math.round(bookings.reduce((sum, b) => sum + b.total_amount, 0) * 0.3).toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                vs traditional agencies
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Start planning your next Umrah journey
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4">
                                <Button asChild>
                                    <Link href="/packages/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create New Package
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/packages">
                                        <Plane className="mr-2 h-4 w-4" />
                                        Browse Packages
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/bookings">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        View Bookings
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Packages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Packages</CardTitle>
                            <CardDescription>
                                Your latest Umrah package creations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Travelers</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packages.slice(0, 3).map((pkg) => (
                                        <TableRow key={pkg.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    {pkg.departure_city} → Saudi Arabia
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {new Date(pkg.departure_date).toLocaleDateString()} - {new Date(pkg.return_date).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    {pkg.adults + pkg.children}
                                                </div>
                                            </TableCell>
                                            <TableCell>€{pkg.total_price.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/packages">View All Packages</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Bookings</CardTitle>
                            <CardDescription>
                                Your confirmed Umrah bookings
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Confirmation</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.slice(0, 3).map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="font-mono text-sm">
                                                    {booking.confirmation_number}
                                                </div>
                                            </TableCell>
                                            <TableCell>€{booking.total_amount.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4">
                                <Button variant="outline" asChild className="w-full">
                                    <Link href="/bookings">View All Bookings</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}