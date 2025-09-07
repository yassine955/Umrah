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

        // Convert flight data to our format
        const flights = flightData.other_flights.map((flight, index) => {
            const outboundFlight = flight.flights[0]
            const returnFlight = flight.flights[1] || flight.flights[0]

            return {
                id: `flight-${index + 1}`,
                airline: outboundFlight.airline,
                airlineLogo: outboundFlight.airline_logo,
                flightNumber: outboundFlight.flight_number,
                airplane: outboundFlight.airplane,
                travelClass: outboundFlight.travel_class,
                legroom: outboundFlight.legroom,
                price: flight.price,
                currency: 'EUR',
                duration: `${Math.floor(flight.total_duration / 60)}h ${flight.total_duration % 60}m`,
                carbonEmissions: flight.carbon_emissions?.this_flight ?
                    Math.round(flight.carbon_emissions.this_flight / 1000) : null,
                layovers: flight.layovers || [],
                extensions: outboundFlight.extensions || [],
                overnight: outboundFlight.overnight || false,
                oftenDelayed: outboundFlight.often_delayed_by_over_30_min || false,
                type: flight.type,
                departure: {
                    airport: outboundFlight.departure_airport.name,
                    code: outboundFlight.departure_airport.id,
                    time: outboundFlight.departure_airport.time
                },
                arrival: {
                    airport: outboundFlight.arrival_airport.name,
                    code: outboundFlight.arrival_airport.id,
                    time: outboundFlight.arrival_airport.time
                },
                return: {
                    departure: {
                        airport: returnFlight.departure_airport.name,
                        code: returnFlight.departure_airport.id,
                        time: returnFlight.departure_airport.time
                    },
                    arrival: {
                        airport: returnFlight.arrival_airport.name,
                        code: returnFlight.arrival_airport.id,
                        time: returnFlight.arrival_airport.time
                    }
                }
            }
        })

        // Get hotels for both cities
        const medinaHotels = hotelData.hotels
            .filter(hotel => hotel.city === 'Medina')
            .map(hotel => ({
                id: hotel.hotel_id,
                name: hotel.name,
                chain: hotel.chain,
                address: hotel.address,
                starRating: hotel.star_rating,
                reviewScore: hotel.review_score,
                reviewCount: hotel.review_count,
                pricePerNight: hotel.price.per_night,
                currency: hotel.price.currency,
                distanceFromCenter: hotel.distance_from_center,
                facilities: hotel.facilities,
                photos: hotel.photos,
                policies: hotel.policies,
                rooms: hotel.rooms.map(room => ({
                    id: room.room_id,
                    name: room.name,
                    capacity: room.capacity,
                    bedType: room.bed_type,
                    pricePerNight: room.price_per_night,
                    amenities: room.amenities,
                    cancellationPolicy: room.cancellation_policy
                }))
            }))

        const meccaHotels = hotelData.hotels
            .filter(hotel => hotel.city === 'Mecca')
            .map(hotel => ({
                id: hotel.hotel_id,
                name: hotel.name,
                chain: hotel.chain,
                address: hotel.address,
                starRating: hotel.star_rating,
                reviewScore: hotel.review_score,
                reviewCount: hotel.review_count,
                pricePerNight: hotel.price.per_night,
                currency: hotel.price.currency,
                distanceFromCenter: hotel.distance_from_center,
                facilities: hotel.facilities,
                photos: hotel.photos,
                policies: hotel.policies,
                rooms: hotel.rooms.map(room => ({
                    id: room.room_id,
                    name: room.name,
                    capacity: room.capacity,
                    bedType: room.bed_type,
                    pricePerNight: room.price_per_night,
                    amenities: room.amenities,
                    cancellationPolicy: room.cancellation_policy
                }))
            }))

        // Sort flights by price (lowest first)
        flights.sort((a, b) => a.price - b.price)

        // Sort hotels by price (lowest first)
        medinaHotels.sort((a, b) => a.pricePerNight - b.pricePerNight)
        meccaHotels.sort((a, b) => a.pricePerNight - b.pricePerNight)

        return NextResponse.json({
            success: true,
            flights,
            hotels: {
                medina: medinaHotels,
                mecca: meccaHotels
            },
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
        console.error('Search options error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch search options' },
            { status: 500 }
        )
    }
}
