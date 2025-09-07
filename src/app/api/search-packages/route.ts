import { NextRequest, NextResponse } from 'next/server'
import flightData from '../../../data/vluchten_expanded.json'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { departureCity, departureDate, returnDate, adults, children } = body

        // For now, we'll use the existing flight data from vluchten.json
        // In a real implementation, you would filter based on the search parameters

        // Convert the flight data to our package format
        const packages = flightData.other_flights.map((flight, index) => {
            const outboundFlight = flight.flights[0]
            const returnFlight = flight.flights[1] || flight.flights[0] // Use same flight for return if no return flight

            return {
                id: `package-${index + 1}`,
                name: `${outboundFlight.airline} Umrah Package`,
                description: `Complete Umrah package with ${outboundFlight.airline} flights`,
                departureCity: outboundFlight.departure_airport.name,
                arrivalCity: outboundFlight.arrival_airport.name,
                departureDate: outboundFlight.departure_airport.time.split(' ')[0],
                returnDate: returnFlight.arrival_airport.time.split(' ')[0],
                duration: `${Math.floor(flight.total_duration / 60)}h ${flight.total_duration % 60}m`,
                price: flight.price,
                currency: 'EUR',
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
                features: [
                    'Round-trip flights',
                    'Economy class',
                    'Carbon offset available',
                    '24/7 customer support'
                ],
                image: '/images/umrah-package.jpg',
                rating: 4.5,
                reviewCount: Math.floor(Math.random() * 100) + 20
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
