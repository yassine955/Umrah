"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Plane,
    Hotel,
    Train,
    Calendar,
    MapPin,
    Users,
    Euro,
    CreditCard,
    Check,
    AlertCircle
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"

// Mock package data
const mockPackage = {
    id: "1",
    departureCity: "Amsterdam",
    departureDate: "2024-03-15",
    returnDate: "2024-03-25",
    adults: 2,
    children: 1,
    totalPrice: 2450.00,
    status: "draft",
    flightOptions: [{
        id: "1",
        airline: "Saudia",
        flightNumber: "SV123",
        departure: "Amsterdam",
        arrival: "Jeddah",
        price: 450.00
    }],
    hotelOptions: [{
        id: "1",
        name: "Makkah Clock Royal Tower",
        city: "Makkah",
        price: 120.00,
        nights: 5
    }],
    railwayOptions: [{
        id: "1",
        route: "Jeddah-Makkah",
        price: 25.00
    }]
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ packageId }: { packageId: string }) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Create payment intent
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packageId }),
        })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret)
            })
            .catch((err) => {
                setError("Failed to initialize payment")
                console.error(err)
            })
    }, [packageId])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements || !clientSecret) {
            return
        }

        setIsLoading(true)
        setError(null)

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
            },
        })

        if (error) {
            setError(error.message || "Payment failed")
            setIsLoading(false)
        } else if (paymentIntent.status === "succeeded") {
            // Payment succeeded
            router.push("/dashboard?payment=success")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Label htmlFor="card-element">Card Details</Label>
                <div className="p-4 border rounded-lg">
                    <CardElement
                        id="card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#424770",
                                    "::placeholder": {
                                        color: "#aab7c4",
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={!stripe || !elements || isLoading}
            >
                {isLoading ? (
                    "Processing Payment..."
                ) : (
                    <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay €{mockPackage.totalPrice.toLocaleString()}
                    </>
                )}
            </Button>
        </form>
    )
}

export default function BookPackagePage({ params }: { params: { id: string } }) {
    const { user, session } = useSupabase()
    const router = useRouter()

    useEffect(() => {
        if (!session) {
            router.push("/auth/signin")
        }
    }, [session, router])

    if (!session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
                    <p className="text-gray-600 mt-2">
                        Review your package details and complete the payment
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Package Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Details</CardTitle>
                            <CardDescription>
                                Your selected Umrah package
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Travel Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">Route</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                    {mockPackage.departureCity} → Saudi Arabia
                                </p>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">Dates</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                    {new Date(mockPackage.departureDate).toLocaleDateString()} - {new Date(mockPackage.returnDate).toLocaleDateString()}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">Travelers</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">
                                    {mockPackage.adults} adults, {mockPackage.children} children
                                </p>
                            </div>

                            <Separator />

                            {/* Flight Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Plane className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">Flight</span>
                                </div>
                                {mockPackage.flightOptions.map((flight) => (
                                    <div key={flight.id} className="ml-6 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{flight.airline} {flight.flightNumber}</p>
                                                <p className="text-sm text-gray-600">{flight.departure} → {flight.arrival}</p>
                                            </div>
                                            <Badge variant="outline">€{flight.price}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Hotel Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Hotel className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Hotels</span>
                                </div>
                                {mockPackage.hotelOptions.map((hotel) => (
                                    <div key={hotel.id} className="ml-6 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{hotel.name}</p>
                                                <p className="text-sm text-gray-600">{hotel.city} • {hotel.nights} nights</p>
                                            </div>
                                            <Badge variant="outline">€{hotel.price * hotel.nights}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Railway Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Train className="h-4 w-4 text-purple-600" />
                                    <span className="font-medium">Railway</span>
                                </div>
                                {mockPackage.railwayOptions.map((railway) => (
                                    <div key={railway.id} className="ml-6 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{railway.route}</p>
                                                <p className="text-sm text-gray-600">Haramain High-Speed Railway</p>
                                            </div>
                                            <Badge variant="outline">€{railway.price}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span className="flex items-center gap-1">
                                    <Euro className="h-4 w-4" />
                                    {mockPackage.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>
                                Secure payment powered by Stripe
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm packageId={params.id} />
                            </Elements>

                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-2 text-green-700 mb-2">
                                    <Check className="h-4 w-4" />
                                    <span className="font-medium">Secure Payment</span>
                                </div>
                                <p className="text-sm text-green-600">
                                    Your payment information is encrypted and secure. We use Stripe for all transactions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
