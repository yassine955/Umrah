"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
    ArrowRight,
    Check,
    Hotel,
    CheckCircle,
    Circle
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Flight {
    id: string
    airline: string
    airlineLogo: string
    flightNumber: string
    airplane: string
    travelClass: string
    legroom: string
    price: number
    currency: string
    duration: string
    carbonEmissions: number | null
    layovers: any[]
    extensions: string[]
    overnight: boolean
    oftenDelayed: boolean
    type: string
    departure: {
        airport: string
        code: string
        time: string
    }
    arrival: {
        airport: string
        code: string
        time: string
    }
    return: {
        departure: {
            airport: string
            code: string
            time: string
        }
        arrival: {
            airport: string
            code: string
            time: string
        }
    }
}

interface Hotel {
    id: string
    name: string
    chain: string
    address: string
    starRating: number
    reviewScore: number
    reviewCount: number
    pricePerNight: number
    currency: string
    distanceFromCenter: string
    facilities: string[]
    photos: string[]
    policies: any
    rooms: any[]
}

interface SearchData {
    flights: Flight[]
    hotels: {
        medina: Hotel[]
        mecca: Hotel[]
    }
}

type Step = 'flights' | 'hotels' | 'summary'

export default function SearchResultsPage() {
    const searchParams = useSearchParams()
    const [currentStep, setCurrentStep] = useState<Step>('flights')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchData, setSearchData] = useState<SearchData | null>(null)
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
    const [selectedMedinaHotel, setSelectedMedinaHotel] = useState<Hotel | null>(null)
    const [selectedMeccaHotel, setSelectedMeccaHotel] = useState<Hotel | null>(null)

    const departureCity = searchParams.get('departureCity') || ''
    const destination = searchParams.get('destination') || ''
    const departureDate = searchParams.get('departureDate') || ''
    const returnDate = searchParams.get('returnDate') || ''
    const adults = searchParams.get('adults') || '1'
    const children = searchParams.get('children') || '0'

    useEffect(() => {
        const fetchSearchOptions = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/search-options', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        departureCity,
                        destination,
                        departureDate,
                        returnDate,
                        adults,
                        children
                    })
                })

                const data = await response.json()

                if (data.success) {
                    setSearchData(data)
                } else {
                    setError(data.error || 'Failed to fetch search options')
                }
            } catch (err) {
                setError('Failed to fetch search options')
                console.error('Search error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchSearchOptions()
    }, [departureCity, destination, departureDate, returnDate, adults, children])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const calculateTotalPrice = () => {
        if (!selectedFlight || !selectedMedinaHotel || !selectedMeccaHotel) return 0

        const flightPrice = selectedFlight.price
        const medinaHotelPrice = selectedMedinaHotel.pricePerNight * 4 // 4 nights in Medina
        const meccaHotelPrice = selectedMeccaHotel.pricePerNight * 3 // 3 nights in Mecca

        return flightPrice + medinaHotelPrice + meccaHotelPrice
    }

    const canProceedToHotels = () => {
        return selectedFlight !== null
    }

    const canProceedToSummary = () => {
        return selectedFlight && selectedMedinaHotel && selectedMeccaHotel
    }

    const renderStepIndicator = () => {
        const steps = [
            { id: 'flights', label: 'Select Flight', icon: Plane },
            { id: 'hotels', label: 'Choose Hotels', icon: Hotel },
            { id: 'summary', label: 'Review & Book', icon: CheckCircle }
        ]

        return (
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = currentStep === step.id
                        const isCompleted = (
                            (step.id === 'flights' && selectedFlight) ||
                            (step.id === 'hotels' && selectedMedinaHotel && selectedMeccaHotel) ||
                            (step.id === 'summary' && canProceedToSummary())
                        )
                        const isAccessible = (
                            step.id === 'flights' ||
                            (step.id === 'hotels' && canProceedToHotels()) ||
                            (step.id === 'summary' && canProceedToSummary())
                        )

                        return (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isCompleted
                                            ? 'bg-green-600 border-green-600 text-white'
                                            : isActive
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : isAccessible
                                                    ? 'border-gray-300 text-gray-500 hover:border-blue-300'
                                                    : 'border-gray-200 text-gray-300'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                    {step.label}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const renderFlightSelection = () => {
        if (!searchData) return null

        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Flight</h2>
                    <p className="text-gray-600">Select the flight that best fits your schedule and budget</p>
                </div>

                <div className="space-y-4">
                    {searchData.flights.map((flight) => (
                        <Card
                            key={flight.id}
                            className={`cursor-pointer transition-all ${selectedFlight?.id === flight.id
                                    ? 'ring-2 ring-blue-600 border-blue-600'
                                    : 'hover:shadow-lg'
                                }`}
                            onClick={() => setSelectedFlight(flight)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={flight.airlineLogo}
                                            alt={flight.airline}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">{flight.airline}</h3>
                                            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600">
                                            €{flight.price}
                                        </div>
                                        <p className="text-sm text-gray-600">per person</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h4 className="font-semibold mb-3">Outbound Flight</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="font-medium">{flight.departure.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(flight.departure.time)} • {formatTime(flight.departure.time)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-px bg-gray-300"></div>
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{flight.duration}</span>
                                                <div className="flex-1 h-px bg-gray-300"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{flight.arrival.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(flight.arrival.time)} • {formatTime(flight.arrival.time)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">Return Flight</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="font-medium">{flight.return.departure.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(flight.return.departure.time)} • {formatTime(flight.return.departure.time)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-px bg-gray-300"></div>
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{flight.duration}</span>
                                                <div className="flex-1 h-px bg-gray-300"></div>
                                            </div>
                                            <div>
                                                <p className="font-medium">{flight.return.arrival.airport}</p>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(flight.return.arrival.time)} • {formatTime(flight.return.arrival.time)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">{flight.travelClass}</Badge>
                                    <Badge variant="secondary">{flight.legroom}</Badge>
                                    <Badge variant="secondary">{flight.airplane}</Badge>
                                    {flight.overnight && <Badge variant="secondary">Overnight</Badge>}
                                    {flight.oftenDelayed && <Badge variant="destructive">Often Delayed</Badge>}
                                    {flight.carbonEmissions && (
                                        <Badge variant="outline">CO₂: {flight.carbonEmissions}kg</Badge>
                                    )}
                                </div>

                                {selectedFlight?.id === flight.id && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                        <span className="text-blue-800 font-medium">Selected Flight</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={() => setCurrentStep('hotels')}
                        disabled={!canProceedToHotels()}
                        className="px-8"
                    >
                        Continue to Hotels
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    const renderHotelSelection = () => {
        if (!searchData) return null

        return (
            <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Hotels</h2>
                    <p className="text-gray-600">Select one hotel in Medina and one hotel in Mecca for your Umrah journey</p>
                </div>

                {/* Medina Hotels */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">M</span>
                        </div>
                        <h3 className="text-xl font-semibold">Medina Hotels</h3>
                        <Badge variant="outline">4 nights recommended</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchData.hotels.medina.map((hotel) => (
                            <Card
                                key={hotel.id}
                                className={`cursor-pointer transition-all ${selectedMedinaHotel?.id === hotel.id
                                        ? 'ring-2 ring-green-600 border-green-600'
                                        : 'hover:shadow-lg'
                                    }`}
                                onClick={() => setSelectedMedinaHotel(hotel)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold">{hotel.name}</h4>
                                            <p className="text-sm text-gray-600">{hotel.chain}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                €{hotel.pricePerNight}
                                            </div>
                                            <p className="text-xs text-gray-600">per night</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(hotel.starRating)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {hotel.reviewScore}/10 ({hotel.reviewCount} reviews)
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{hotel.distanceFromCenter} from Haram</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {hotel.facilities.slice(0, 3).map((facility, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {facility}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedMedinaHotel?.id === hotel.id && (
                                        <div className="p-2 bg-green-50 rounded flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-green-800 text-sm font-medium">Selected for Medina</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mecca Hotels */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <h3 className="text-xl font-semibold">Mecca Hotels</h3>
                        <Badge variant="outline">3 nights recommended</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchData.hotels.mecca.map((hotel) => (
                            <Card
                                key={hotel.id}
                                className={`cursor-pointer transition-all ${selectedMeccaHotel?.id === hotel.id
                                        ? 'ring-2 ring-blue-600 border-blue-600'
                                        : 'hover:shadow-lg'
                                    }`}
                                onClick={() => setSelectedMeccaHotel(hotel)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold">{hotel.name}</h4>
                                            <p className="text-sm text-gray-600">{hotel.chain}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600">
                                                €{hotel.pricePerNight}
                                            </div>
                                            <p className="text-xs text-gray-600">per night</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1">
                                            {[...Array(hotel.starRating)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {hotel.reviewScore}/10 ({hotel.reviewCount} reviews)
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{hotel.distanceFromCenter} from Haram</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {hotel.facilities.slice(0, 3).map((facility, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {facility}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedMeccaHotel?.id === hotel.id && (
                                        <div className="p-2 bg-blue-50 rounded flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-800 text-sm font-medium">Selected for Mecca</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep('flights')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Flights
                    </Button>
                    <Button
                        onClick={() => setCurrentStep('summary')}
                        disabled={!canProceedToSummary()}
                        className="px-8"
                    >
                        Review Package
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }

    const renderSummary = () => {
        if (!selectedFlight || !selectedMedinaHotel || !selectedMeccaHotel) return null

        const totalPrice = calculateTotalPrice()
        const medinaHotelTotal = selectedMedinaHotel.pricePerNight * 4
        const meccaHotelTotal = selectedMeccaHotel.pricePerNight * 3

        return (
            <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Umrah Package</h2>
                    <p className="text-gray-600">Please review your selections before proceeding to booking</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Package Details */}
                    <div className="space-y-6">
                        {/* Flight Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plane className="h-5 w-5" />
                                    Selected Flight
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={selectedFlight.airlineLogo}
                                        alt={selectedFlight.airline}
                                        className="w-10 h-10 rounded"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{selectedFlight.airline}</h4>
                                        <p className="text-sm text-gray-600">{selectedFlight.flightNumber}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-lg font-bold text-green-600">
                                            €{selectedFlight.price}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{selectedFlight.departure.airport} → {selectedFlight.arrival.airport}</p>
                                    <p>{selectedFlight.travelClass} • {selectedFlight.duration}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hotels Summary */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hotel className="h-5 w-5" />
                                        Medina Hotel (4 nights)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{selectedMedinaHotel.name}</h4>
                                            <p className="text-sm text-gray-600">{selectedMedinaHotel.chain}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(selectedMedinaHotel.starRating)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                €{medinaHotelTotal}
                                            </div>
                                            <p className="text-xs text-gray-600">€{selectedMedinaHotel.pricePerNight}/night</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hotel className="h-5 w-5" />
                                        Mecca Hotel (3 nights)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{selectedMeccaHotel.name}</h4>
                                            <p className="text-sm text-gray-600">{selectedMeccaHotel.chain}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(selectedMeccaHotel.starRating)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600">
                                                €{meccaHotelTotal}
                                            </div>
                                            <p className="text-xs text-gray-600">€{selectedMeccaHotel.pricePerNight}/night</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div>
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Flight ({selectedFlight.airline})</span>
                                        <span>€{selectedFlight.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Medina Hotel (4 nights)</span>
                                        <span>€{medinaHotelTotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Mecca Hotel (3 nights)</span>
                                        <span>€{meccaHotelTotal}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Package Price</span>
                                        <span className="text-green-600">€{totalPrice}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>✓ Round-trip flights included</p>
                                    <p>✓ 7 nights accommodation</p>
                                    <p>✓ 24/7 customer support</p>
                                    <p>✓ Free cancellation up to 24h before departure</p>
                                </div>

                                <Button asChild className="w-full" size="lg">
                                    <Link href={`/packages/custom/book?flight=${selectedFlight.id}&medina=${selectedMedinaHotel.id}&mecca=${selectedMeccaHotel.id}`}>
                                        Book This Package
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep('hotels')}
                                    className="w-full"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Hotels
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your search options...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button asChild>
                            <Link href="/">
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
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    New Search
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-900">Build Your Umrah Package</h1>
                            <p className="text-gray-600 mt-1">
                                {departureCity} → {destination} • {adults} adults, {children} children
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {renderStepIndicator()}

                {currentStep === 'flights' && renderFlightSelection()}
                {currentStep === 'hotels' && renderHotelSelection()}
                {currentStep === 'summary' && renderSummary()}
            </div>
        </div>
    )
}