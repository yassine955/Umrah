"use client"

import { useState } from "react"
import { useSupabase } from "@/components/providers"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Hotel, Train, Search, Calendar, MapPin, Users, Euro, Star } from "lucide-react"
import Link from "next/link"

// Dummy data for packages
const dummyPackages = [
    {
        id: "1",
        title: "Premium Umrah Package - 10 Days",
        description: "Complete Umrah package with 5-star hotels and premium flights",
        departureCity: "Amsterdam",
        departureDate: "2024-03-15",
        returnDate: "2024-03-25",
        adults: 2,
        totalPrice: 2899.00,
        status: "available",
        flightOptions: [
            {
                id: "f1",
                airline: "KLM Royal Dutch Airlines",
                departure: "2024-03-15T08:00:00Z",
                arrival: "2024-03-15T16:30:00Z",
                price: 1200.00,
                class: "Economy"
            }
        ],
        hotelOptions: [
            {
                id: "h1",
                name: "Hilton Makkah Convention Hotel",
                location: "Makkah",
                checkIn: "2024-03-15",
                checkOut: "2024-03-20",
                price: 800.00,
                rating: 4.5,
                amenities: ["WiFi", "Pool", "Restaurant", "Gym"]
            },
            {
                id: "h2",
                name: "Madinah Hilton",
                location: "Madinah",
                checkIn: "2024-03-20",
                checkOut: "2024-03-25",
                price: 750.00,
                rating: 4.3,
                amenities: ["WiFi", "Pool", "Restaurant"]
            }
        ],
        railwayOptions: [
            {
                id: "r1",
                route: "Jeddah - Makkah",
                departure: "2024-03-15T18:00:00Z",
                arrival: "2024-03-15T19:30:00Z",
                price: 149.00,
                class: "Business"
            }
        ]
    },
    {
        id: "2",
        title: "Budget Umrah Package - 7 Days",
        description: "Affordable Umrah package with comfortable accommodations",
        departureCity: "Brussels",
        departureDate: "2024-04-01",
        returnDate: "2024-04-08",
        adults: 1,
        totalPrice: 1599.00,
        status: "available",
        flightOptions: [
            {
                id: "f2",
                airline: "Brussels Airlines",
                departure: "2024-04-01T10:00:00Z",
                arrival: "2024-04-01T18:00:00Z",
                price: 800.00,
                class: "Economy"
            }
        ],
        hotelOptions: [
            {
                id: "h3",
                name: "Al Madinah Concorde Hotel",
                location: "Madinah",
                checkIn: "2024-04-01",
                checkOut: "2024-04-08",
                price: 799.00,
                rating: 4.0,
                amenities: ["WiFi", "Restaurant"]
            }
        ],
        railwayOptions: []
    },
    {
        id: "3",
        title: "Family Umrah Package - 14 Days",
        description: "Perfect for families with children, includes all amenities",
        departureCity: "Paris",
        departureDate: "2024-05-10",
        returnDate: "2024-05-24",
        adults: 4,
        totalPrice: 4599.00,
        status: "available",
        flightOptions: [
            {
                id: "f3",
                airline: "Air France",
                departure: "2024-05-10T14:00:00Z",
                arrival: "2024-05-10T22:30:00Z",
                price: 2000.00,
                class: "Economy"
            }
        ],
        hotelOptions: [
            {
                id: "h4",
                name: "Swissotel Makkah",
                location: "Makkah",
                checkIn: "2024-05-10",
                checkOut: "2024-05-17",
                price: 1200.00,
                rating: 4.7,
                amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Spa"]
            },
            {
                id: "h5",
                name: "Pullman Zamzam Madinah",
                location: "Madinah",
                checkIn: "2024-05-17",
                checkOut: "2024-05-24",
                price: 1399.00,
                rating: 4.6,
                amenities: ["WiFi", "Pool", "Restaurant", "Gym"]
            }
        ],
        railwayOptions: [
            {
                id: "r2",
                route: "Jeddah - Makkah",
                departure: "2024-05-10T20:00:00Z",
                arrival: "2024-05-10T21:30:00Z",
                price: 200.00,
                class: "Business"
            },
            {
                id: "r3",
                route: "Makkah - Madinah",
                departure: "2024-05-17T10:00:00Z",
                arrival: "2024-05-17T12:00:00Z",
                price: 300.00,
                class: "Business"
            }
        ]
    }
]

export default function BrowsePackagesPage() {
    const { user, session } = useSupabase()
    const router = useRouter()
    const [searchParams, setSearchParams] = useState({
        departureCity: "",
        departureDate: "",
        returnDate: "",
        adults: "1"
    })
    const [filteredPackages, setFilteredPackages] = useState(dummyPackages)

    const handleSearch = () => {
        let filtered = dummyPackages

        if (searchParams.departureCity) {
            filtered = filtered.filter(pkg =>
                pkg.departureCity.toLowerCase().includes(searchParams.departureCity.toLowerCase())
            )
        }

        if (searchParams.departureDate) {
            filtered = filtered.filter(pkg =>
                pkg.departureDate >= searchParams.departureDate
            )
        }

        if (searchParams.returnDate) {
            filtered = filtered.filter(pkg =>
                pkg.returnDate <= searchParams.returnDate
            )
        }

        if (searchParams.adults) {
            filtered = filtered.filter(pkg =>
                pkg.adults >= parseInt(searchParams.adults)
            )
        }

        setFilteredPackages(filtered)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-EU', {
            style: 'currency',
            currency: 'EUR'
        }).format(price)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Umrah Packages</h1>
                    <p className="text-gray-600">Find the perfect Umrah package for your spiritual journey</p>
                </div>

                {/* Search Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search Packages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="departureCity">Departure City</Label>
                                <Input
                                    id="departureCity"
                                    placeholder="e.g., Amsterdam"
                                    value={searchParams.departureCity}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, departureCity: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="departureDate">Departure Date</Label>
                                <Input
                                    id="departureDate"
                                    type="date"
                                    value={searchParams.departureDate}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="returnDate">Return Date</Label>
                                <Input
                                    id="returnDate"
                                    type="date"
                                    value={searchParams.returnDate}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="adults">Adults</Label>
                                <Select
                                    value={searchParams.adults}
                                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, adults: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button onClick={handleSearch} className="mt-4">
                            <Search className="h-4 w-4 mr-2" />
                            Search Packages
                        </Button>
                    </CardContent>
                </Card>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPackages.map((pkg) => (
                        <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{pkg.title}</CardTitle>
                                        <CardDescription className="mt-1">{pkg.description}</CardDescription>
                                    </div>
                                    <Badge variant="secondary">{pkg.status}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Package Details */}
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{pkg.departureCity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span>{pkg.adults} {pkg.adults === 1 ? 'Adult' : 'Adults'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span>{formatDate(pkg.departureDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span>{formatDate(pkg.returnDate)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Flight Info */}
                                    {pkg.flightOptions.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Plane className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium text-sm">Flight</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {pkg.flightOptions[0].airline} - {pkg.flightOptions[0].class}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hotel Info */}
                                    {pkg.hotelOptions.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Hotel className="h-4 w-4 text-green-500" />
                                                <span className="font-medium text-sm">Hotels</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {pkg.hotelOptions.map((hotel, index) => (
                                                    <div key={hotel.id} className="flex items-center gap-2">
                                                        <span>{hotel.name}</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs">{hotel.rating}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Railway Info */}
                                    {pkg.railwayOptions.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Train className="h-4 w-4 text-purple-500" />
                                                <span className="font-medium text-sm">Railway</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {pkg.railwayOptions.map((railway) => (
                                                    <div key={railway.id}>
                                                        {railway.route} - {railway.class}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Price and Action */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatPrice(pkg.totalPrice)}
                                            </div>
                                            <div className="text-sm text-gray-500">per package</div>
                                        </div>
                                        <Button asChild>
                                            <Link href={`/packages/${pkg.id}/book`}>
                                                Book Now
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredPackages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">No packages found matching your criteria</div>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchParams({ departureCity: "", departureDate: "", returnDate: "", adults: "1" })
                                setFilteredPackages(dummyPackages)
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
