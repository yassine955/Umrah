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
    Filter,
    SortAsc,
    SortDesc
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function SearchResultsPage() {
    const searchParams = useSearchParams()
    const [packages, setPackages] = useState<FlightPackage[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState("price")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    const departureCity = searchParams.get('departureCity') || ''
    const departureDate = searchParams.get('departureDate') || ''
    const returnDate = searchParams.get('returnDate') || ''
    const adults = searchParams.get('adults') || '1'
    const children = searchParams.get('children') || '0'

    useEffect(() => {
        const searchPackages = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/search-packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        departureCity,
                        departureDate,
                        returnDate,
                        adults,
                        children
                    })
                })

                const data = await response.json()

                if (data.success) {
                    setPackages(data.packages)
                } else {
                    setError(data.error || 'Failed to search packages')
                }
            } catch (err) {
                setError('Failed to search packages')
                console.error('Search error:', err)
            } finally {
                setLoading(false)
            }
        }

        searchPackages()
    }, [departureCity, departureDate, returnDate, adults, children])

    const sortedPackages = [...packages].sort((a, b) => {
        let aValue: any, bValue: any

        switch (sortBy) {
            case 'price':
                aValue = a.price
                bValue = b.price
                break
            case 'duration':
                aValue = a.duration
                bValue = b.duration
                break
            case 'rating':
                aValue = a.rating
                bValue = b.rating
                break
            default:
                aValue = a.price
                bValue = b.price
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Searching for the best Umrah packages...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                            <p className="text-gray-600 mt-1">
                                {packages.length} packages found for your Umrah journey
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                New Search
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="price">Price</SelectItem>
                                            <SelectItem value="duration">Duration</SelectItem>
                                            <SelectItem value="rating">Rating</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Order</label>
                                    <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="asc">Low to High</SelectItem>
                                            <SelectItem value="desc">High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Results */}
                    <div className="lg:w-3/4">
                        <div className="space-y-6">
                            {sortedPackages.map((pkg) => (
                                <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Flight Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={pkg.airlineLogo}
                                                            alt={pkg.airline}
                                                            className="w-8 h-8 rounded"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{pkg.airline}</h3>
                                                            <p className="text-sm text-gray-600">{pkg.flightNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-green-600">
                                                            €{pkg.price}
                                                        </div>
                                                        <p className="text-sm text-gray-600">per person</p>
                                                    </div>
                                                </div>

                                                {/* Flight Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4 text-gray-500" />
                                                            <span className="text-sm font-medium">Departure</span>
                                                        </div>
                                                        <p className="font-semibold">{pkg.departureCity}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(pkg.departureDate)} • {formatTime(pkg.departureDate + ' 02:40')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MapPin className="h-4 w-4 text-gray-500" />
                                                            <span className="text-sm font-medium">Arrival</span>
                                                        </div>
                                                        <p className="font-semibold">{pkg.arrivalCity}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(pkg.returnDate)} • {formatTime(pkg.returnDate + ' 10:40')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Flight Features */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <Badge variant="secondary">{pkg.travelClass}</Badge>
                                                    <Badge variant="secondary">{pkg.legroom}</Badge>
                                                    <Badge variant="secondary">{pkg.airplane}</Badge>
                                                    {pkg.overnight && <Badge variant="secondary">Overnight</Badge>}
                                                    {pkg.oftenDelayed && <Badge variant="destructive">Often Delayed</Badge>}
                                                </div>

                                                {/* Extensions */}
                                                {pkg.extensions.length > 0 && (
                                                    <div className="mb-4">
                                                        <p className="text-sm text-gray-600 mb-2">Included:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {pkg.extensions.slice(0, 3).map((extension, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {extension}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action */}
                                            <div className="lg:w-48 flex flex-col justify-between">
                                                <div className="text-center mb-4">
                                                    <div className="flex items-center justify-center gap-1 mb-2">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium">{pkg.rating}</span>
                                                        <span className="text-sm text-gray-600">({pkg.reviewCount} reviews)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{pkg.duration}</span>
                                                    </div>
                                                </div>
                                                <Button asChild className="w-full">
                                                    <Link href={`/packages/${pkg.id}/book`}>
                                                        Select Package
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {packages.length === 0 && (
                            <div className="text-center py-12">
                                <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your search criteria or dates
                                </p>
                                <Button asChild>
                                    <Link href="/">New Search</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
