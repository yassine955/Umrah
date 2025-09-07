"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Plane,
    Hotel,
    Train,
    Calendar,
    MapPin,
    Users,
    Euro,
    FileText,
    Download,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react"
import Link from "next/link"

// Dummy data for bookings
const dummyBookings = [
    {
        id: "booking-1",
        packageId: "1",
        packageTitle: "Premium Umrah Package - 10 Days",
        status: "confirmed",
        bookingDate: "2024-01-15T10:30:00Z",
        departureDate: "2024-03-15",
        returnDate: "2024-03-25",
        adults: 2,
        totalPrice: 2899.00,
        paymentStatus: "paid",
        paymentMethod: "Credit Card",
        referenceNumber: "UMR-2024-001",
        flightDetails: {
            airline: "KLM Royal Dutch Airlines",
            departure: "2024-03-15T08:00:00Z",
            arrival: "2024-03-15T16:30:00Z",
            class: "Economy"
        },
        hotelDetails: [
            {
                name: "Hilton Makkah Convention Hotel",
                location: "Makkah",
                checkIn: "2024-03-15",
                checkOut: "2024-03-20"
            },
            {
                name: "Madinah Hilton",
                location: "Madinah",
                checkIn: "2024-03-20",
                checkOut: "2024-03-25"
            }
        ],
        railwayDetails: [
            {
                route: "Jeddah - Makkah",
                departure: "2024-03-15T18:00:00Z",
                arrival: "2024-03-15T19:30:00Z",
                class: "Business"
            }
        ]
    },
    {
        id: "booking-2",
        packageId: "2",
        packageTitle: "Budget Umrah Package - 7 Days",
        status: "pending",
        bookingDate: "2024-01-20T14:15:00Z",
        departureDate: "2024-04-01",
        returnDate: "2024-04-08",
        adults: 1,
        totalPrice: 1599.00,
        paymentStatus: "pending",
        paymentMethod: "Bank Transfer",
        referenceNumber: "UMR-2024-002",
        flightDetails: {
            airline: "Brussels Airlines",
            departure: "2024-04-01T10:00:00Z",
            arrival: "2024-04-01T18:00:00Z",
            class: "Economy"
        },
        hotelDetails: [
            {
                name: "Al Madinah Concorde Hotel",
                location: "Madinah",
                checkIn: "2024-04-01",
                checkOut: "2024-04-08"
            }
        ],
        railwayDetails: []
    },
    {
        id: "booking-3",
        packageId: "3",
        packageTitle: "Family Umrah Package - 14 Days",
        status: "cancelled",
        bookingDate: "2024-01-10T09:45:00Z",
        departureDate: "2024-05-10",
        returnDate: "2024-05-24",
        adults: 4,
        totalPrice: 4599.00,
        paymentStatus: "refunded",
        paymentMethod: "Credit Card",
        referenceNumber: "UMR-2024-003",
        flightDetails: {
            airline: "Air France",
            departure: "2024-05-10T14:00:00Z",
            arrival: "2024-05-10T22:30:00Z",
            class: "Economy"
        },
        hotelDetails: [
            {
                name: "Swissotel Makkah",
                location: "Makkah",
                checkIn: "2024-05-10",
                checkOut: "2024-05-17"
            },
            {
                name: "Pullman Zamzam Madinah",
                location: "Madinah",
                checkIn: "2024-05-17",
                checkOut: "2024-05-24"
            }
        ],
        railwayDetails: [
            {
                route: "Jeddah - Makkah",
                departure: "2024-05-10T20:00:00Z",
                arrival: "2024-05-10T21:30:00Z",
                class: "Business"
            },
            {
                route: "Makkah - Madinah",
                departure: "2024-05-17T10:00:00Z",
                arrival: "2024-05-17T12:00:00Z",
                class: "Business"
            }
        ]
    }
]

export default function BookingsPage() {
    const { user, session } = useSupabase()
    const router = useRouter()
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

    // Redirect if not authenticated
    if (!session) {
        router.push("/auth/signin")
        return null
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: 'EUR'
        }).format(price)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
            case 'refunded':
                return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />Refunded</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const selectedBookingData = dummyBookings.find(booking => booking.id === selectedBooking)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">Manage your Umrah bookings and view booking details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bookings List */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking History</CardTitle>
                                <CardDescription>
                                    {dummyBookings.length} booking{dummyBookings.length !== 1 ? 's' : ''} found
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dummyBookings.map((booking) => (
                                        <Card
                                            key={booking.id}
                                            className={`cursor-pointer transition-colors ${selectedBooking === booking.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => setSelectedBooking(booking.id)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{booking.packageTitle}</h3>
                                                        <p className="text-sm text-gray-600">Ref: {booking.referenceNumber}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {formatPrice(booking.totalPrice)}
                                                        </div>
                                                        {getStatusBadge(booking.status)}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span>Departure: {formatDate(booking.departureDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span>Return: {formatDate(booking.returnDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-500" />
                                                        <span>{booking.adults} {booking.adults === 1 ? 'Adult' : 'Adults'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Euro className="h-4 w-4 text-gray-500" />
                                                        <span>Payment: {getPaymentStatusBadge(booking.paymentStatus)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Details */}
                    <div className="lg:col-span-1">
                        {selectedBookingData ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Booking Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Booking Info */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Booking Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Reference:</span>
                                                <span className="font-medium">{selectedBookingData.referenceNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Booking Date:</span>
                                                <span>{formatDateTime(selectedBookingData.bookingDate)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                {getStatusBadge(selectedBookingData.status)}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment:</span>
                                                {getPaymentStatusBadge(selectedBookingData.paymentStatus)}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Method:</span>
                                                <span>{selectedBookingData.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Flight Details */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Plane className="h-4 w-4" />
                                            Flight Details
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Airline:</span>
                                                <span>{selectedBookingData.flightDetails.airline}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Class:</span>
                                                <span>{selectedBookingData.flightDetails.class}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Departure:</span>
                                                <span>{formatDateTime(selectedBookingData.flightDetails.departure)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Arrival:</span>
                                                <span>{formatDateTime(selectedBookingData.flightDetails.arrival)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Hotel Details */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <Hotel className="h-4 w-4" />
                                            Hotel Details
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedBookingData.hotelDetails.map((hotel, index) => (
                                                <div key={index} className="text-sm">
                                                    <div className="font-medium">{hotel.name}</div>
                                                    <div className="text-gray-600">{hotel.location}</div>
                                                    <div className="text-gray-600">
                                                        {formatDate(hotel.checkIn)} - {formatDate(hotel.checkOut)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Railway Details */}
                                    {selectedBookingData.railwayDetails.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <Train className="h-4 w-4" />
                                                    Railway Details
                                                </h4>
                                                <div className="space-y-3">
                                                    {selectedBookingData.railwayDetails.map((railway, index) => (
                                                        <div key={index} className="text-sm">
                                                            <div className="font-medium">{railway.route}</div>
                                                            <div className="text-gray-600">{railway.class}</div>
                                                            <div className="text-gray-600">
                                                                {formatDateTime(railway.departure)} - {formatDateTime(railway.arrival)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <Separator />

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <Button className="w-full" variant="outline">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Invoice
                                        </Button>
                                        <Button className="w-full" variant="outline">
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Documents
                                        </Button>
                                        {selectedBookingData.status === 'confirmed' && (
                                            <Button className="w-full" variant="outline">
                                                Modify Booking
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="font-semibold text-gray-900 mb-2">Select a Booking</h3>
                                    <p className="text-gray-600">Choose a booking from the list to view details</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
