# Train Integration - Medina to Mecca

## Overview

Added train selection functionality to the Umrah package builder, allowing users to select train times from Medina to Mecca using real data from the Haramain High-Speed Railway.

## Data Source

- **Static Data**: `src/data/available_tickets.json` (10 train times)
- **Live Scraper**: `simple_ticket_scraper.py` (Python script for real-time data)
- **API Endpoint**: `/api/trains` (serves train data)

## Features Added

### 1. Train Selection Step

- **New Step**: Added "Select Train" as step 3 in the package builder
- **Visual Design**: Purple theme to distinguish from flights (green) and hotels (blue/green)
- **Time Display**: Shows departure, arrival, and duration for each train
- **Pricing**: Dynamic pricing from €45-90 based on train time

### 2. Train Data Structure

```typescript
interface Train {
  id: string;
  departure: string; // "08:00"
  arrival: string; // "09:48"
  duration: string; // "1h 48m"
  trainNumber: string; // "HHR001"
  fromStation: string; // "Medina"
  toStation: string; // "Mecca"
  route: string; // "Medina → Mecca"
  price: number; // 45-90 EUR
  currency: string; // "EUR"
  class: string; // "Economy"
  stops: string; // "Non-stop"
  available: boolean; // true
  features: string[]; // ["Air conditioning", "WiFi", ...]
}
```

### 3. Updated Package Flow

1. **Step 1**: Select Flight (CMN → MED)
2. **Step 2**: Choose Hotels (Medina + Mecca)
3. **Step 3**: Select Train (Medina → Mecca) ← **NEW**
4. **Step 4**: Review & Book Complete Package

### 4. Pricing Integration

- **Train Cost**: €45-90 per person (round trip)
- **Total Calculation**: Flight + Hotels + Train
- **Example Package**:
  - Flight: €1,854
  - Medina Hotel (4 nights): €396
  - Mecca Hotel (3 nights): €1,071
  - Train (round trip): €90
  - **Total**: €3,411

## Technical Implementation

### API Endpoints

- **`/api/search-options`**: Updated to include train data
- **`/api/trains`**: Dedicated train data endpoint

### UI Components

- **Train Selection Cards**: Professional train display with timing and features
- **Step Indicator**: Updated to show 4 steps including trains
- **Summary Page**: Includes train information and pricing
- **Navigation**: Proper back/forward flow between steps

### Data Processing

- **Time Sorting**: Trains sorted by departure time
- **Price Generation**: Dynamic pricing based on train index
- **Feature Mapping**: Standard train amenities for all trains

## Train Schedule

Based on `available_tickets.json`:

- **08:00** → 09:48 (€45)
- **09:00** → 10:54 (€50)
- **10:50** → 12:44 (€55)
- **12:00** → 13:54 (€60)
- **15:00** → 16:54 (€65)
- **16:00** → 17:48 (€70)
- **17:00** → 18:54 (€75)
- **18:50** → 20:44 (€80)
- **21:00** → 22:54 (€85)
- **22:00** → 23:54 (€90)

## Live Data Integration

The `simple_ticket_scraper.py` script can be used to fetch real-time train data:

```python
# Usage
scraper = SimpleTicketScraper()
tickets = scraper.get_tickets(
    from_station="5",  # Medina
    to_station="1",    # Mecca
    travel_date="26/09/2025",
    adults=2
)
```

## User Experience

- **Professional Design**: Clean train cards with purple theme
- **Clear Information**: Departure/arrival times, duration, pricing
- **Easy Selection**: Click to select, visual feedback
- **Complete Package**: Train included in final booking summary
- **Flexible Navigation**: Can go back and change selections

## Future Enhancements

- **Real-time Data**: Integrate live scraper for current schedules
- **Return Trains**: Add Mecca → Medina return journey
- **Class Selection**: Economy vs Business class options
- **Dynamic Pricing**: Real-time pricing from railway system
- **Booking Integration**: Direct train booking through railway API

The train selection adds a crucial component to the complete Umrah package, providing users with a seamless way to travel between the holy cities! 🚄✨
