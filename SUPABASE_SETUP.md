# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `umrah-dashboard`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# Note: No DATABASE_URL needed - using Supabase client directly

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 4. Set Up Database Schema

### Using Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following SQL to create the tables:

```sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  passport_number TEXT,
  passport_expiry TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  departure_city TEXT NOT NULL,
  departure_date TIMESTAMP NOT NULL,
  return_date TIMESTAMP NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flight_options table
CREATE TABLE public.flight_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotel_options table
CREATE TABLE public.hotel_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DECIMAL(2,1),
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  nights INTEGER NOT NULL,
  amenities TEXT[],
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create railway_options table
CREATE TABLE public.railway_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  departure_time TIMESTAMP NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  confirmation_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.railway_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own packages" ON public.packages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own packages" ON public.packages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own packages" ON public.packages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own flight options" ON public.flight_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.packages
      WHERE packages.id = flight_options.package_id
      AND packages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own hotel options" ON public.hotel_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.packages
      WHERE packages.id = hotel_options.package_id
      AND packages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own railway options" ON public.railway_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.packages
      WHERE packages.id = railway_options.package_id
      AND packages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 5. Configure Authentication

### Enable Email Authentication

1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure email templates if needed

### Enable Google OAuth (Optional)

1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, enable **Google**
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:3000` (development) or your production URL
   - **Redirect URLs**:
     - `http://localhost:3000/dashboard`
     - `https://your-domain.com/dashboard`

## 6. Set Up Database Functions (Optional)

Create a function to automatically create user profiles:

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 7. Test Your Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Try to sign up with a new account

4. Check your Supabase dashboard to see if the user was created

## 8. Production Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Update Site URLs

1. Go to **Authentication** → **URL Configuration**
2. Update **Site URL** to your production domain
3. Add production redirect URLs

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check your environment variables
2. **"User not found"**: Ensure RLS policies are set up correctly
3. **"Permission denied"**: Check your RLS policies and user permissions
4. **Database connection issues**: Verify your DATABASE_URL format

### Useful Commands

```bash
# Check Supabase connection
npx supabase status

# Generate types from your database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

# Reset your local database (if using local development)
npx supabase db reset
```

## Next Steps

1. Set up Stripe for payments
2. Configure external APIs (Amadeus, Booking.com)
3. Deploy to production
4. Set up monitoring and analytics

For more information, visit the [Supabase Documentation](https://supabase.com/docs).
