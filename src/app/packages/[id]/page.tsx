"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Plane,
    Clock,
    Users,
    MapPin,
    Star,
    ArrowLeft,
    Check,
    Wifi,
    Power,
    Video,
    Coffee
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FlightPackage {
    id: string
    name: string
    description: string
    departureCity: string
    arrivalCity: string
    departureDate: string
    returnDate: string
    duration: string
    price: number
    currency: string
    airline: string
    airlineLogo: string
    flightNumber: string
    airplane: string
    travelClass: string
    legroom: string
    carbonEmissions: number | null
    layovers: any[]
    extensions: string[]
    overnight: boolean
    oftenDelayed: boolean
    type: string
    features: string[]
    image: string
    rating: number
    reviewCount: number
}

export default function PackageDetailPage() {
    const params = useParams()
    const [packageData, setPackageData] = useState<FlightPackage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // For now, we'll create a mock package based on the ID
        // In a real implementation, you would fetch from an API
        const mockPackage: FlightPackage = {
            id: params.id as string,
            name: "Royal Air Maroc Umrah Package",
            description: "Complete Umrah package with Royal Air Maroc flights from Casablanca to Madinah",
            departureCity: "Casablanca Mohammed V International Airport",
            arrivalCity: "Prince Mohammad Bin Abdulaziz International Airport",
            departureDate: "2025-09-10",
            returnDate: "2025-09-20",
            duration: "6h 0m",
            price: 1854,
            currency: "EUR",
            airline: "Royal Air Maroc",
            airlineLogo: "https://www.gstatic.com/flights/airline_logos/70px/AT.png",
            flightNumber: "AT 248",
            airplane: "Airbus A330",
            travelClass: "Economy",
            legroom: "31 in",
            carbonEmissions: 675,
            layovers: [],
            extensions: [
                "Average legroom (31 in)",
                "Stream media to your device",
                "Carbon emissions estimate: 675 kg"
            ],
            overnight: true,
            oftenDelayed: false,
            type: "Round trip",
            features: [
                "Round-trip flights",
                "Economy class",
                "Carbon offset available",
                "24/7 customer support"
            ],
            image: "/images/umrah-package.jpg",
            rating: 4.5,
            reviewCount: 87
        }

        setPackageData(mockPackage)
        setLoading(false)
    }, [params.id])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading package details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !packageData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error || 'Package not found'}</p>
                        <Button asChild>
                            <Link href="/search">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Search
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Button variant="ghost" asChild className="mb-4">
                                <Link href="/search">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Search Results
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold text-gray-900">{packageData.name}</h1>
                            <p className="text-gray-600 mt-2">{packageData.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">
                                €{packageData.price}
                            </div>
                            <p className="text-sm text-gray-600">per person</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flight Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plane className="h-5 w-5" />
                                    Flight Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Outbound Flight */}
                                    <div>
                                        <h4 className="font-semibold mb-4">Outbound Flight</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={packageData.airlineLogo}
                                                    alt={packageData.airline}
                                                    className="w-12 h-12 rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">{packageData.airline}</p>
                                                    <p className="text-sm text-gray-600">{packageData.flightNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{packageData.airplane}</p>
                                                <p className="text-sm text-gray-600">{packageData.travelClass}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Departure</p>
                                                <p className="font-semibold">{packageData.departureCity}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(packageData.departureDate)} • 02:40
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Arrival</p>
                                                <p className="font-semibold">{packageData.arrivalCity}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(packageData.departureDate)} • 10:40
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Return Flight */}
                                    <div>
                                        <h4 className="font-semibold mb-4">Return Flight</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={packageData.airlineLogo}
                                                    alt={packageData.airline}
                                                    className="w-12 h-12 rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">{packageData.airline}</p>
                                                    <p className="text-sm text-gray-600">{packageData.flightNumber}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">{packageData.airplane}</p>
                                                <p className="text-sm text-gray-600">{packageData.travelClass}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Departure</p>
                                                <p className="font-semibold">{packageData.arrivalCity}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(packageData.returnDate)} • 14:30
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Arrival</p>
                                                <p className="font-semibold">{packageData.departureCity}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(packageData.returnDate)} • 22:30
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>What's Included</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {packageData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Flight Amenities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Flight Amenities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {packageData.extensions.map((extension, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <span className="text-sm">{extension}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Book This Package</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        €{packageData.price}
                                    </div>
                                    <p className="text-sm text-gray-600">per person</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Duration:</span>
                                        <span>{packageData.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Class:</span>
                                        <span>{packageData.travelClass}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Legroom:</span>
                                        <span>{packageData.legroom}</span>
                                    </div>
                                    {packageData.carbonEmissions && (
                                        <div className="flex justify-between text-sm">
                                            <span>Carbon:</span>
                                            <span>{packageData.carbonEmissions} kg</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{packageData.rating}</span>
                                    <span className="text-gray-600">({packageData.reviewCount} reviews)</span>
                                </div>

                                <Button asChild className="w-full" size="lg">
                                    <Link href={`/packages/${packageData.id}/book`}>
                                        Book Now
                                    </Link>
                                </Button>

                                <p className="text-xs text-gray-500 text-center">
                                    Free cancellation up to 24 hours before departure
                                </p>
                            </CardContent>
                        </Card>

                        {/* Package Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Package Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Type:</span>
                                    <span className="text-sm font-medium">{packageData.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Airline:</span>
                                    <span className="text-sm font-medium">{packageData.airline}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Aircraft:</span>
                                    <span className="text-sm font-medium">{packageData.airplane}</span>
                                </div>
                                {packageData.overnight && (
                                    <Badge variant="secondary" className="w-full justify-center">
                                        Overnight Flight
                                    </Badge>
                                )}
                                {packageData.oftenDelayed && (
                                    <Badge variant="destructive" className="w-full justify-center">
                                        Often Delayed
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
