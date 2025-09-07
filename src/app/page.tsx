"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plane, Hotel, Train, Search } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    departureCity: "",
    departureDate: "",
    returnDate: "",
    adults: "1",
    children: "0"
  })

  const handleSearch = () => {
    // Build search URL with parameters
    const searchUrl = new URL('/search', window.location.origin)
    searchUrl.searchParams.set('departureCity', searchParams.departureCity)
    searchUrl.searchParams.set('departureDate', searchParams.departureDate)
    searchUrl.searchParams.set('returnDate', searchParams.returnDate)
    searchUrl.searchParams.set('adults', searchParams.adults)
    searchUrl.searchParams.set('children', searchParams.children)

    // Navigate to search results page
    window.location.href = searchUrl.toString()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-blue-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="relative py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-white mb-16">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
                🕌 Your Spiritual Journey Starts Here
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Plan Your Perfect
                <span className="block text-yellow-300">Umrah Journey</span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Create affordable Umrah packages with automatic integration of flights, hotels, and transport.
                <span className="block mt-2 text-yellow-200 font-semibold">
                  Save 30-50% compared to traditional travel agencies
                </span>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">€1,599</div>
                  <div className="text-green-100">Average Package Price</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">15 min</div>
                  <div className="text-green-100">Package Assembly Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">50%</div>
                  <div className="text-green-100">Cost Savings</div>
                </div>
              </div>
            </div>

            {/* Search Form */}
            <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-900">
                  <Search className="h-6 w-6 text-green-600" />
                  Find Your Perfect Umrah Package
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Get the best deals on flights, hotels, and transport in under 15 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                        <SelectItem value="CMN">Casablanca (CMN)</SelectItem>
                        <SelectItem value="AMS">Amsterdam (AMS)</SelectItem>
                        <SelectItem value="BRU">Brussels (BRU)</SelectItem>
                        <SelectItem value="CDG">Paris (CDG)</SelectItem>
                        <SelectItem value="LHR">London (LHR)</SelectItem>
                        <SelectItem value="FRA">Frankfurt (FRA)</SelectItem>
                        <SelectItem value="MAD">Madrid (MAD)</SelectItem>
                        <SelectItem value="FCO">Rome (FCO)</SelectItem>
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

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleSearch}
                    className="w-full sm:w-auto"
                    size="lg"
                    variant="default"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search Packages
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/packages/create">
                      <Plane className="mr-2 h-4 w-4" />
                      Create Custom Package
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Link href="/packages">
                  Browse All Packages
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/auth/signup">
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              ✨ Why Choose Umrah Dashboard?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for Your
              <span className="block text-green-600">Spiritual Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform combines the best of technology and travel expertise to make your Umrah journey seamless and affordable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Best Flight Deals</CardTitle>
                <CardDescription>
                  Compare prices from multiple airlines and get the best deals on flights to Saudi Arabia
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Hotel className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Quality Hotels</CardTitle>
                <CardDescription>
                  Find hotels near the Haram in Makkah and Nabawi Mosque in Madinah with transparent pricing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Train className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Haramain Railway</CardTitle>
                <CardDescription>
                  Book high-speed train tickets between Jeddah, Makkah, and Madinah for comfortable travel
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Save Money & Time
            </h2>
            <p className="text-lg text-gray-600">
              Our intelligent platform helps you create the perfect Umrah package
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">30-50%</div>
              <div className="text-gray-600">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">&lt;15 min</div>
              <div className="text-gray-600">Package Creation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Price Transparency</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            🚀 Start Your Journey Today
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your
            <span className="block text-yellow-300">Umrah Journey?</span>
          </h2>
          <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-3xl mx-auto">
            Join thousands of Muslims who have saved money and time with our intelligent platform.
            <span className="block mt-2 text-yellow-200 font-semibold">
              Your spiritual journey deserves the best planning.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="bg-white text-green-700 hover:bg-gray-100">
              <Link href="/auth/signup">
                Create Free Account
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/packages">
                Browse Packages
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-300">1000+</div>
              <div className="text-green-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">€500K+</div>
              <div className="text-green-100">Saved by Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-300">4.9★</div>
              <div className="text-green-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}