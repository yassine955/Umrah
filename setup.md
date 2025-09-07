# Umrah Dashboard Setup Guide

## Quick Setup Instructions

### 1. Environment Configuration

```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view your database
npm run db:studio
```

### 3. Start Development

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## Required Environment Variables

### Minimum Required for MVP

```env
DATABASE_URL="postgresql://username:password@localhost:5432/umrah_dashboard"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### For Full Functionality

```env
# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# External APIs (optional for MVP)
AMADEUS_API_KEY="your-amadeus-api-key"
AMADEUS_API_SECRET="your-amadeus-api-secret"
BOOKING_COM_API_KEY="your-booking-api-key"
```

## Database Setup Options

### Option 1: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `umrah_dashboard`
3. Update `DATABASE_URL` in `.env.local`

### Option 2: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection string to `DATABASE_URL`

### Option 3: Supabase

1. Go to [Supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string to `DATABASE_URL`

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your test keys from the dashboard
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## Testing the Application

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try creating an account or signing in
4. Create a test package
5. Test the payment flow (use Stripe test cards)

## Common Issues

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your `DATABASE_URL` format
- Run `npm run db:push` to sync schema

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check OAuth provider configuration
- Ensure callback URLs are correct

### Payment Issues

- Verify Stripe keys are correct
- Check webhook endpoint configuration
- Use test mode for development

## Next Steps

1. Set up your database
2. Configure environment variables
3. Test the basic functionality
4. Customize the UI and branding
5. Set up production deployment

For detailed documentation, see [README.md](README.md)
