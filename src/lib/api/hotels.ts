// Mock hotel search API - in production this would integrate with Booking.com API

export interface HotelOption {
    id: string
    name: string
    city: string
    address: string
    rating?: number
    price: number
    currency: string
    nights: number
    amenities: string[]
    distanceToHaram?: number // in meters
}

export interface HotelSearchParams {
    city: string
    checkIn: string
    checkOut: string
    adults: number
    children: number
}

export async function searchHotels(params: HotelSearchParams): Promise<HotelOption[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const nights = Math.ceil((new Date(params.checkOut).getTime() - new Date(params.checkIn).getTime()) / (1000 * 60 * 60 * 24))

    // Mock hotel data
    const mockHotels: HotelOption[] = [
        {
            id: "1",
            name: "Makkah Clock Royal Tower",
            city: "Makkah",
            address: "Near Masjid al-Haram",
            rating: 4.5,
            price: 120.00,
            currency: "EUR",
            nights,
            amenities: ["WiFi", "Breakfast", "Prayer Room", "Air Conditioning", "24/7 Room Service"],
            distanceToHaram: 200
        },
        {
            id: "2",
            name: "Madinah Hilton",
            city: "Madinah",
            address: "Near Masjid an-Nabawi",
            rating: 4.3,
            price: 95.00,
            currency: "EUR",
            nights,
            amenities: ["WiFi", "Breakfast", "Prayer Room", "Gym", "Spa"],
            distanceToHaram: 300
        },
        {
            id: "3",
            name: "Raffles Makkah Palace",
            city: "Makkah",
            address: "Abraj Al Bait Complex",
            rating: 4.7,
            price: 180.00,
            currency: "EUR",
            nights,
            amenities: ["WiFi", "Breakfast", "Prayer Room", "Luxury Spa", "Multiple Restaurants"],
            distanceToHaram: 150
        },
        {
            id: "4",
            name: "Pullman Zamzam Madinah",
            city: "Madinah",
            address: "Near Prophet's Mosque",
            rating: 4.2,
            price: 85.00,
            currency: "EUR",
            nights,
            amenities: ["WiFi", "Breakfast", "Prayer Room", "Business Center"],
            distanceToHaram: 400
        }
    ]

    // Filter by city if specified
    if (params.city && params.city !== 'all') {
        return mockHotels.filter(hotel =>
            hotel.city.toLowerCase() === params.city.toLowerCase()
        )
    }

    return mockHotels
}

// Real Booking.com API integration would look like this:
/*
export async function searchHotelsReal(params: HotelSearchParams): Promise<HotelOption[]> {
  const bookingApiKey = process.env.BOOKING_COM_API_KEY!
  
  try {
    const response = await fetch('https://distribution-xml.booking.com/2.0/json/hotelAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bookingApiKey}`
      },
      body: JSON.stringify({
        checkin: params.checkIn,
        checkout: params.checkOut,
        rooms: [{
          adults: params.adults,
          children: params.children
        }],
        destination: getCityCode(params.city)
      })
    })

    const data = await response.json()
    
    return data.result.map((hotel: any) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      city: params.city,
      address: hotel.address,
      rating: hotel.rating,
      price: hotel.min_price,
      currency: hotel.currency,
      nights: calculateNights(params.checkIn, params.checkOut),
      amenities: hotel.amenities || [],
      distanceToHaram: hotel.distance_to_haram
    }))
  } catch (error) {
    console.error('Booking.com API error:', error)
    throw new Error('Failed to search hotels')
  }
}

function getCityCode(city: string): string {
  const codes: { [key: string]: string } = {
    'makkah': 'MAK',
    'madinah': 'MAD'
  }
  return codes[city.toLowerCase()] || 'MAK'
}

function calculateNights(checkIn: string, checkOut: string): number {
  return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
}
*/
