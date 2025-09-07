// Mock Haramain Railway API - in production this would scrape or integrate with the official railway system

export interface RailwayOption {
    id: string
    route: string
    departure: string
    arrival: string
    departureTime: string
    arrivalTime: string
    price: number
    currency: string
    duration: number // in minutes
    class: 'economy' | 'business' | 'first'
}

export interface RailwaySearchParams {
    route: string
    date: string
    passengers: number
}

export async function searchRailway(params: RailwaySearchParams): Promise<RailwayOption[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock railway data based on route
    const mockRailwayOptions: RailwayOption[] = []

    if (params.route === 'jeddah-makkah' || params.route === 'all') {
        mockRailwayOptions.push(
            {
                id: "1",
                route: "Jeddah-Makkah",
                departure: "Jeddah Airport",
                arrival: "Makkah",
                departureTime: `${params.date}T17:00:00`,
                arrivalTime: `${params.date}T18:30:00`,
                price: 25.00,
                currency: "EUR",
                duration: 90,
                class: 'economy'
            },
            {
                id: "2",
                route: "Jeddah-Makkah",
                departure: "Jeddah Airport",
                arrival: "Makkah",
                departureTime: `${params.date}T19:30:00`,
                arrivalTime: `${params.date}T21:00:00`,
                price: 25.00,
                currency: "EUR",
                duration: 90,
                class: 'economy'
            },
            {
                id: "3",
                route: "Jeddah-Makkah",
                departure: "Jeddah Airport",
                arrival: "Makkah",
                departureTime: `${params.date}T17:00:00`,
                arrivalTime: `${params.date}T18:30:00`,
                price: 45.00,
                currency: "EUR",
                duration: 90,
                class: 'business'
            }
        )
    }

    if (params.route === 'makkah-madinah' || params.route === 'all') {
        mockRailwayOptions.push(
            {
                id: "4",
                route: "Makkah-Madinah",
                departure: "Makkah",
                arrival: "Madinah",
                departureTime: `${params.date}T10:00:00`,
                arrivalTime: `${params.date}T12:30:00`,
                price: 35.00,
                currency: "EUR",
                duration: 150,
                class: 'economy'
            },
            {
                id: "5",
                route: "Makkah-Madinah",
                departure: "Makkah",
                arrival: "Madinah",
                departureTime: `${params.date}T14:00:00`,
                arrivalTime: `${params.date}T16:30:00`,
                price: 35.00,
                currency: "EUR",
                duration: 150,
                class: 'economy'
            },
            {
                id: "6",
                route: "Makkah-Madinah",
                departure: "Makkah",
                arrival: "Madinah",
                departureTime: `${params.date}T10:00:00`,
                arrivalTime: `${params.date}T12:30:00`,
                price: 65.00,
                currency: "EUR",
                duration: 150,
                class: 'business'
            }
        )
    }

    if (params.route === 'madinah-jeddah' || params.route === 'all') {
        mockRailwayOptions.push(
            {
                id: "7",
                route: "Madinah-Jeddah",
                departure: "Madinah",
                arrival: "Jeddah Airport",
                departureTime: `${params.date}T08:00:00`,
                arrivalTime: `${params.date}T10:30:00`,
                price: 30.00,
                currency: "EUR",
                duration: 150,
                class: 'economy'
            },
            {
                id: "8",
                route: "Madinah-Jeddah",
                departure: "Madinah",
                arrival: "Jeddah Airport",
                departureTime: `${params.date}T12:00:00`,
                arrivalTime: `${params.date}T14:30:00`,
                price: 30.00,
                currency: "EUR",
                duration: 150,
                class: 'economy'
            }
        )
    }

    return mockRailwayOptions
}

// Real Haramain Railway integration would look like this:
/*
export async function searchRailwayReal(params: RailwaySearchParams): Promise<RailwayOption[]> {
  try {
    // This would involve web scraping the official Haramain Railway website
    // or integrating with their API if available
    const response = await fetch('https://haramain.hhr.sa/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'UmrahDashboard/1.0'
      },
      body: JSON.stringify({
        origin: getStationCode(params.route.split('-')[0]),
        destination: getStationCode(params.route.split('-')[1]),
        departureDate: params.date,
        passengers: params.passengers
      })
    })

    const data = await response.json()
    
    return data.trains.map((train: any) => ({
      id: train.id,
      route: `${train.origin}-${train.destination}`,
      departure: train.origin_station,
      arrival: train.destination_station,
      departureTime: train.departure_time,
      arrivalTime: train.arrival_time,
      price: train.price,
      currency: 'SAR',
      duration: train.duration_minutes,
      class: train.class
    }))
  } catch (error) {
    console.error('Haramain Railway API error:', error)
    throw new Error('Failed to search railway options')
  }
}

function getStationCode(station: string): string {
  const codes: { [key: string]: string } = {
    'jeddah': 'JED',
    'makkah': 'MAK',
    'madinah': 'MAD'
  }
  return codes[station.toLowerCase()] || station.toUpperCase()
}
*/
