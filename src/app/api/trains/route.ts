import { NextRequest, NextResponse } from 'next/server'
import trainData from '../../../data/available_tickets.json'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const fromStation = searchParams.get('from') || 'medina'
        const toStation = searchParams.get('to') || 'mecca'
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

        // For now, we'll use the static data from available_tickets.json
        // In a real implementation, you would call the scraper or use a live API

        // Transform the train data to include more details
        const trains = trainData.map((train, index) => ({
            id: `train-${index + 1}`,
            departure: train.departure,
            arrival: train.arrival,
            duration: train.duration,
            trainNumber: `HHR${String(index + 1).padStart(3, '0')}`, // Generate train number
            fromStation: 'Medina',
            toStation: 'Mecca',
            route: 'Medina → Mecca',
            price: 45 + (index * 5), // Dummy pricing: €45-90
            currency: 'EUR',
            class: 'Economy',
            stops: 'Non-stop',
            available: true,
            features: [
                'Air conditioning',
                'WiFi',
                'Power outlets',
                'Comfortable seating',
                'Luggage storage'
            ]
        }))

        // Sort by departure time
        trains.sort((a, b) => {
            const timeA = a.departure.split(':').map(Number)
            const timeB = b.departure.split(':').map(Number)
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
        })

        return NextResponse.json({
            success: true,
            trains,
            searchParams: {
                fromStation,
                toStation,
                date
            }
        })

    } catch (error) {
        console.error('Train search error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch train data' },
            { status: 500 }
        )
    }
}
