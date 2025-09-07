import { NextRequest, NextResponse } from 'next/server'
import flightData from '../../../data/vluchten_expanded.json'
import hotelData from '../../../data/hotels_mecca_medina.json'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { departureCity, destination, departureDate, returnDate, adults, children } = body

        // Validate search parameters
        if (!departureCity || !destination) {
            return NextResponse.json({
                success: false,
                error: 'Please select both departure city and destination'
            }, { status: 400 })
        }

        // Check if the route exists in our flight data
        const searchParams = flightData.search_parameters
        const hasValidRoute = searchParams.departure_id === departureCity && searchParams.arrival_id === destination

        if (!hasValidRoute) {
            return NextResponse.json({
                success: false,
                error: `No flights found for route ${departureCity} to ${destination}. Currently only CMN to MED route is available.`
            }, { status: 404 })
        }

        // For now, we'll use the existing flight data from vluchten.json
        // In a real implementation, you would filter based on the search parameters

        // Get hotels for the destination city
        const destinationHotels = hotelData.hotels.filter(hotel => {
            if (destination === 'MED') {
                return hotel.city === 'Medina'
            } else if (destination === 'JED') {
                return hotel.city === 'Mecca'
            }
            return false
        })

        // Convert the flight data to our package format with hotel combinations
        const packages = flightData.other_flights.map((flight, index) => {
            const outboundFlight = flight.flights[0]
            const returnFlight = flight.flights[1] || flight.flights[0] // Use same flight for return if no return flight

            // Find a suitable hotel for this flight
            const suitableHotels = destinationHotels.filter(hotel => {
                // Filter hotels by price range (cheap combinations)
                const hotelPricePerNight = hotel.price.per_night
                const flightPrice = flight.price

                // Create budget-friendly combinations
                if (flightPrice < 2000) {
                    return hotelPricePerNight < 200 // Budget hotels for cheap flights
                } else if (flightPrice < 3000) {
                    return hotelPricePerNight < 300 // Mid-range hotels
                } else {
                    return hotelPricePerNight < 400 // Premium hotels for expensive flights
                }
            })

            // Select the cheapest suitable hotel
            const selectedHotel = suitableHotels.sort((a, b) => a.price.per_night - b.price.per_night)[0] || destinationHotels[0]

            // Calculate total package price (flight + hotel for 7 nights)
            const hotelNights = 7
            const hotelTotal = selectedHotel ? selectedHotel.price.per_night * hotelNights : 0
            const totalPrice = flight.price + hotelTotal

            return {
                id: `package-${index + 1}`,
                name: `${outboundFlight.airline} + ${selectedHotel?.name || 'Hotel'} Package`,
                description: `Complete Umrah package with ${outboundFlight.airline} flights and ${selectedHotel?.name || 'hotel'} accommodation`,
                departureCity: outboundFlight.departure_airport.name,
                arrivalCity: outboundFlight.arrival_airport.name,
                departureDate: outboundFlight.departure_airport.time.split(' ')[0],
                returnDate: returnFlight.arrival_airport.time.split(' ')[0],
                duration: `${Math.floor(flight.total_duration / 60)}h ${flight.total_duration % 60}m`,
                price: totalPrice,
                currency: 'EUR',
                flightPrice: flight.price,
                hotelPrice: hotelTotal,
                airline: outboundFlight.airline,
                airlineLogo: outboundFlight.airline_logo,
                flightNumber: outboundFlight.flight_number,
                airplane: outboundFlight.airplane,
                travelClass: outboundFlight.travel_class,
                legroom: outboundFlight.legroom,
                carbonEmissions: flight.carbon_emissions?.this_flight ?
                    Math.round(flight.carbon_emissions.this_flight / 1000) : null,
                layovers: flight.layovers || [],
                extensions: outboundFlight.extensions || [],
                overnight: outboundFlight.overnight || false,
                oftenDelayed: outboundFlight.often_delayed_by_over_30_min || false,
                type: flight.type,
                hotel: selectedHotel ? {
                    id: selectedHotel.hotel_id,
                    name: selectedHotel.name,
                    starRating: selectedHotel.star_rating,
                    reviewScore: selectedHotel.review_score,
                    reviewCount: selectedHotel.review_count,
                    pricePerNight: selectedHotel.price.per_night,
                    distanceFromCenter: selectedHotel.distance_from_center,
                    facilities: selectedHotel.facilities,
                    photos: selectedHotel.photos
                } : null,
                features: [
                    'Round-trip flights',
                    '7 nights hotel accommodation',
                    selectedHotel?.facilities?.includes('Shuttle to Haram') ? 'Shuttle to Haram' : 'Transport to Haram',
                    '24/7 customer support'
                ],
                image: selectedHotel?.photos?.[0] || '/images/umrah-package.jpg',
                rating: selectedHotel ? selectedHotel.review_score / 2 : 4.5, // Convert 10-point scale to 5-point
                reviewCount: selectedHotel?.review_count || Math.floor(Math.random() * 100) + 20
            }
        })

        // Sort by price (lowest first)
        packages.sort((a, b) => a.price - b.price)

        return NextResponse.json({
            success: true,
            packages,
            totalResults: packages.length,
            searchParams: {
                departureCity,
                destination,
                departureDate,
                returnDate,
                adults,
                children
            }
        })

    } catch (error) {
        console.error('Search packages error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to search packages' },
            { status: 500 }
        )
    }
}
