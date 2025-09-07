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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
    Plane,
    Hotel,
    Train,
    Search,
    Calendar,
    MapPin,
    Users,
    Euro,
    Check,
    Clock,
    Star
} from "lucide-react"

// Mock data for demonstration
const mockFlights = [
    {
        id: "1",
        airline: "Saudia",
        flightNumber: "SV123",
        departure: "Amsterdam",
        arrival: "Jeddah",
        departureTime: "2024-03-15T08:00:00",
        arrivalTime: "2024-03-15T15:30:00",
        price: 450.00,
        currency: "EUR"
    },
    {
        id: "2",
        airline: "KLM",
        flightNumber: "KL1234",
        departure: "Amsterdam",
        arrival: "Jeddah",
        departureTime: "2024-03-15T14:00:00",
        arrivalTime: "2024-03-15T21:30:00",
        price: 520.00,
        currency: "EUR"
    }
]

const mockHotels = [
    {
        id: "1",
        name: "Makkah Clock Royal Tower",
        city: "Makkah",
        address: "Near Masjid al-Haram",
        rating: 4.5,
        price: 120.00,
        currency: "EUR",
        nights: 5,
        amenities: ["WiFi", "Breakfast", "Prayer Room", "Air Conditioning"]
    },
    {
        id: "2",
        name: "Madinah Hilton",
        city: "Madinah",
        address: "Near Masjid an-Nabawi",
        rating: 4.3,
        price: 95.00,
        currency: "EUR",
        nights: 3,
        amenities: ["WiFi", "Breakfast", "Prayer Room", "Gym"]
    }
]

const mockRailway = [
    {
        id: "1",
        route: "Jeddah-Makkah",
        departure: "Jeddah Airport",
        arrival: "Makkah",
        departureTime: "2024-03-15T17:00:00",
        arrivalTime: "2024-03-15T18:30:00",
        price: 25.00,
        currency: "EUR"
    },
    {
        id: "2",
        route: "Makkah-Madinah",
        departure: "Makkah",
        arrival: "Madinah",
        departureTime: "2024-03-20T10:00:00",
        arrivalTime: "2024-03-20T12:30:00",
        price: 35.00,
        currency: "EUR"
    }
]

export default function CreatePackagePage() {
    const { user, session } = useSupabase()
    const router = useRouter()
    const [searchParams, setSearchParams] = useState({
        departureCity: "",
        departureDate: "",
        returnDate: "",
        adults: "1",
        children: "0"
    })
    const [selectedFlight, setSelectedFlight] = useState<string | null>(null)
    const [selectedHotels, setSelectedHotels] = useState<string[]>([])
    const [selectedRailway, setSelectedRailway] = useState<string[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        // Simulate API call
        setTimeout(() => {
            setIsSearching(false)
        }, 2000)
    }

    const calculateTotal = () => {
        let total = 0

        if (selectedFlight) {
            const flight = mockFlights.find(f => f.id === selectedFlight)
            if (flight) total += flight.price * parseInt(searchParams.adults)
        }

        selectedHotels.forEach(hotelId => {
            const hotel = mockHotels.find(h => h.id === hotelId)
            if (hotel) total += hotel.price * hotel.nights
        })

        selectedRailway.forEach(railwayId => {
            const railway = mockRailway.find(r => r.id === railwayId)
            if (railway) total += railway.price * parseInt(searchParams.adults)
        })

        return total
    }

    const handleCreatePackage = () => {
        // In a real app, this would create the package in the database
        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create Umrah Package</h1>
                    <p className="text-gray-600 mt-2">
                        Search and select your flights, hotels, and transport options
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Search Form */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Search Parameters</CardTitle>
                                <CardDescription>
                                    Enter your travel details to find the best options
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="departure">Departure City</Label>
                                    <Select
                                        value={searchParams.departureCity}
                                        onValueChange={(value) => setSearchParams(prev => ({ ...prev, departureCity: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="amsterdam">Amsterdam</SelectItem>
                                            <SelectItem value="brussels">Brussels</SelectItem>
                                            <SelectItem value="paris">Paris</SelectItem>
                                            <SelectItem value="london">London</SelectItem>
                                            <SelectItem value="frankfurt">Frankfurt</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="departure-date">Departure Date</Label>
                                    <Input
                                        id="departure-date"
                                        type="date"
                                        value={searchParams.departureDate}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="return-date">Return Date</Label>
                                    <Input
                                        id="return-date"
                                        type="date"
                                        value={searchParams.returnDate}
                                        onChange={(e) => setSearchParams(prev => ({ ...prev, returnDate: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="children">Children</Label>
                                        <Select
                                            value={searchParams.children}
                                            onValueChange={(value) => setSearchParams(prev => ({ ...prev, children: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[0, 1, 2, 3, 4, 5].map(num => (
                                                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSearch}
                                    className="w-full"
                                    disabled={isSearching}
                                >
                                    {isSearching ? (
                                        <>
                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="mr-2 h-4 w-4" />
                                            Search Options
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Package Summary */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Package Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Flight</span>
                                        <span>
                                            {selectedFlight ?
                                                `€${mockFlights.find(f => f.id === selectedFlight)?.price || 0}` :
                                                "Not selected"
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Hotels</span>
                                        <span>
                                            {selectedHotels.length > 0 ?
                                                `€${selectedHotels.reduce((sum, id) => {
                                                    const hotel = mockHotels.find(h => h.id === id)
                                                    return sum + (hotel ? hotel.price * hotel.nights : 0)
                                                }, 0)}` :
                                                "Not selected"
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Railway</span>
                                        <span>
                                            {selectedRailway.length > 0 ?
                                                `€${selectedRailway.reduce((sum, id) => {
                                                    const railway = mockRailway.find(r => r.id === id)
                                                    return sum + (railway ? railway.price : 0)
                                                }, 0)}` :
                                                "Not selected"
                                            }
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>€{calculateTotal().toLocaleString()}</span>
                                    </div>
                                    <Button
                                        onClick={handleCreatePackage}
                                        className="w-full"
                                        disabled={!selectedFlight || selectedHotels.length === 0}
                                    >
                                        Create Package
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search Results */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Flights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plane className="h-5 w-5" />
                                    Flight Options
                                </CardTitle>
                                <CardDescription>
                                    Select your preferred flight
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Airline</TableHead>
                                            <TableHead>Route</TableHead>
                                            <TableHead>Departure</TableHead>
                                            <TableHead>Arrival</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Select</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockFlights.map((flight) => (
                                            <TableRow key={flight.id}>
                                                <TableCell>
                                                    <div className="font-medium">{flight.airline}</div>
                                                    <div className="text-sm text-gray-500">{flight.flightNumber}</div>
                                                </TableCell>
                                                <TableCell>
                                                    {flight.departure} → {flight.arrival}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(flight.departureTime).toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(flight.arrivalTime).toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    €{flight.price}
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedFlight === flight.id}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedFlight(flight.id)
                                                            } else {
                                                                setSelectedFlight(null)
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Hotels */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Hotel className="h-5 w-5" />
                                    Hotel Options
                                </CardTitle>
                                <CardDescription>
                                    Select hotels for your stay (you can select multiple)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockHotels.map((hotel) => (
                                        <div key={hotel.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-medium">{hotel.name}</h3>
                                                        <Badge variant="outline">{hotel.city}</Badge>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-sm">{hotel.rating}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {hotel.amenities.map((amenity) => (
                                                            <Badge key={amenity} variant="secondary" className="text-xs">
                                                                {amenity}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {hotel.nights} nights • €{hotel.price}/night
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-lg font-bold">€{hotel.price * hotel.nights}</div>
                                                    <div className="text-sm text-gray-500">total</div>
                                                    <Checkbox
                                                        checked={selectedHotels.includes(hotel.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedHotels(prev => [...prev, hotel.id])
                                                            } else {
                                                                setSelectedHotels(prev => prev.filter(id => id !== hotel.id))
                                                            }
                                                        }}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Railway */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Train className="h-5 w-5" />
                                    Haramain Railway Options
                                </CardTitle>
                                <CardDescription>
                                    Select train connections (you can select multiple)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Route</TableHead>
                                            <TableHead>Departure</TableHead>
                                            <TableHead>Arrival</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Select</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockRailway.map((railway) => (
                                            <TableRow key={railway.id}>
                                                <TableCell className="font-medium">{railway.route}</TableCell>
                                                <TableCell>
                                                    <div>{railway.departure}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(railway.departureTime).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>{railway.arrival}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(railway.arrivalTime).toLocaleTimeString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {Math.round((new Date(railway.arrivalTime).getTime() - new Date(railway.departureTime).getTime()) / (1000 * 60 * 60))}h
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    €{railway.price}
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRailway.includes(railway.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedRailway(prev => [...prev, railway.id])
                                                            } else {
                                                                setSelectedRailway(prev => prev.filter(id => id !== railway.id))
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
