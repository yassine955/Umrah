# Umrah Dashboard SaaS - MVP

An intelligent SaaS platform that enables Muslims to create affordable Umrah packages with automatic integration of flights, hotels, and transport.

## 🚀 Features

### MVP Features (Implemented)

- ✅ **Authentication & User Management** - Supabase Auth with email and Google OAuth
- ✅ **Package Search & Assembly** - Mock integrations for flights, hotels, and railway
- ✅ **Comparison & Selection** - Interactive package builder with real-time pricing
- ✅ **Booking & Payment** - Stripe integration for secure payments
- ✅ **User Dashboard** - Package management and booking overview
- ✅ **Responsive UI** - Modern design with shadcn/ui components

### Planned Features

- 🔄 **Google Maps Integration** - Distance calculations to Haram/Nabawi
- 🔄 **Travel Intelligence** - Weather, packing suggestions, checklists
- 🔄 **Visa Support System** - Document upload and status tracking
- 🔄 **In-app Support** - Chat and ticket system
- 🔄 **Mobile App** - React Native application

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Supabase Client
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **State Management:** Zustand, React Query
- **External APIs:** Amadeus (flights), Booking.com (hotels), Haramain Railway

## 📋 Prerequisites

- Node.js 18+
- Supabase account
- Stripe account
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd umrah-website
npm install
```

### 2. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Note: No DATABASE_URL needed - using Supabase client directly

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# External APIs (Optional for MVP)
AMADEUS_API_KEY="your-amadeus-api-key"
AMADEUS_API_SECRET="your-amadeus-api-secret"
BOOKING_COM_API_KEY="your-booking-api-key"
```

For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### 3. Database Setup

The database schema is managed directly in Supabase. Follow the setup instructions in [SUPABASE_SETUP.md](SUPABASE_SETUP.md) to create the required tables and RLS policies.

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── packages/          # Package management
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation component
│   └── providers.tsx     # Context providers
├── lib/                  # Utility libraries
│   ├── api/              # External API integrations
│   ├── supabase.ts       # Supabase client configuration
│   ├── supabase-server.ts # Server-side Supabase client
│   └── stripe.ts         # Stripe configuration
```

## 🔧 Configuration

### Database

The application uses Supabase (PostgreSQL) directly through the Supabase client. The schema includes:

- Users and authentication (integrated with Supabase Auth)
- Packages with flight, hotel, and railway options
- Bookings and payment tracking
- Row Level Security (RLS) policies for data protection

### Authentication

- Supabase Auth with multiple providers
- Email/password authentication
- Google OAuth for social login
- Row Level Security (RLS) for data protection

### Payments

- Stripe integration for secure payments
- Webhook handling for payment status updates
- Support for EUR currency

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway (Backend)

1. Create a new Railway project
2. Add PostgreSQL database
3. Set environment variables
4. Deploy the application

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="production-secret"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 📊 Business Model

### Revenue Streams

- **Affiliate Commissions:** Booking.com (3-7%), Amadeus fees, Railway markup (5-10%)
- **Service Fees:** €5-15 per package
- **Premium Subscription:** €9.99/month (planned)
- **Visa Services:** €25 processing fee (planned)

### Target Metrics

- **MVP (3 months):** 100 users, 10 bookings
- **Growth (6 months):** 1000+ users, €50k+ revenue
- **Scale (12 months):** 5000+ users, market expansion

## 🔒 Security & Compliance

- **GDPR Compliant** for EU users
- **PCI DSS Compliant** via Stripe
- **Data Encryption** (AES-256, HTTPS/TLS)
- **Secure API Authentication** (JWT tokens)
- **Saudi Arabia Visa Requirements** compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@umrahdashboard.com or create an issue in the repository.

## 🗺️ Roadmap

### Phase 1 (0-3 months) - MVP ✅

- [x] Authentication system
- [x] Package search and creation
- [x] Payment integration
- [x] Basic dashboard

### Phase 2 (4-6 months) - Advanced

- [ ] Google Maps integration
- [ ] Visa support system
- [ ] Travel intelligence features
- [ ] Mobile responsiveness improvements

### Phase 3 (7-12 months) - Scale

- [ ] Premium subscription tier
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Market expansion

---

**Built with ❤️ for the Muslim community**
