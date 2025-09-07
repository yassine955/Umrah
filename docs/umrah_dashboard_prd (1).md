# Umrah Dashboard SaaS – Product Requirements Document (PRD)

**Document Version:** 1.0  
**Last Updated:** September 2025  
**Status:** Ready for Development  
**Next Review:** October 2025  

---

## 1. Executive Summary

### Product Vision
Een intelligente SaaS-platform dat moslims in staat stelt om zelf goedkope Umrah-pakketten samen te stellen door automatische integratie van vluchten, hotels en transport, met een transparant dashboard voor pakketbeheer.

### Problem Statement
- Traditionele reisbureaus rekenen €2000–3000 voor korte Umrah-trips (10 dagen).  
- Zelf plannen via verschillende platforms is tijdrovend en complex.  
- Gebrek aan transparantie in prijsstelling en pakketsamenstelling.  
- Handmatige processen voor visa-aanvragen en lokaal transport.  

### Solution Overview
Een geïntegreerd dashboard dat automatisch:  
- Vluchten aggregeert via APIs  
- Hotels matcht via affiliate programma’s  
- Lokaal transport (Haramain Railway) integreert  
- Visa-proces vereenvoudigt  
- Alles combineert in overzichtelijke pakketten met prijstransparantie  

---

## 2. Product Scope & Objectives

### Primary Objectives
- **Cost Reduction:** 30–50% goedkoper dan traditionele reisbureaus  
- **Time Saving:** Pakket samenstellen in <15 minuten  
- **Transparency:** Volledige breakdown van alle kosten  
- **User Experience:** Intuïtief dashboard voor alle reisbehoeften  

### Success Metrics
- **MVP (3 maanden):** 100 geregistreerde gebruikers, 10 voltooide boekingen  
- **Growth (6 maanden):** 1000+ gebruikers, €50k+ affiliate revenue  
- **Scale (12 maanden):** 5000+ gebruikers, uitbreiding naar andere markten  

### Out of Scope (MVP)
- Geen groepsreizen met gidsen/bus  
- Geen offline boekingsopties  
- Geen Hajj-pakketten (alleen Umrah)  

---

## 3. User Personas & Use Cases

### Primary Persona: Zelfstandige Umrah Planner
- **Demografisch:** 25–45 jaar, tech-savvy moslim  
- **Motivatie:** Kostenbesparing, controle over reisplan  
- **Pain Points:** Tijdgebrek, complexiteit van zelf plannen  
- **Goals:** Goedkoop, betrouwbaar, complete reis organiseren  

### Secondary Persona: Family Organizer
- **Demografisch:** 35–55 jaar, ouders met kinderen  
- **Motivatie:** Comfort en groepskorting  
- **Pain Points:** Visa-aanvragen voor meerdere personen  
- **Goals:** Gezinsvriendelijke pakketten, makkelijke groepsbetaling  

### Tertiary Persona: Elder Traveler
- **Demografisch:** 55+ jaar, minder tech-savvy  
- **Motivatie:** Spirituele reis, eenvoud  
- **Pain Points:** Moeite met online platforms  
- **Goals:** Simpele flow, betrouwbare ondersteuning  

### Use Cases
- **Pakket Discovery:** Zoeken naar pakketten op basis van datums  
- **Pakket Vergelijking:** Prijzen en voorzieningen vergelijken  
- **Boekingsproces:** Pakket selecteren en boeken  
- **Reisbeheer:** Actieve en toekomstige reizen beheren  
- **Visa Support:** Ondersteuning bij e-visa aanvraag  

---

## 4. Feature Specification

### 4.1 MVP Features (0–3 maanden)
- **Authentication & User Management** (NextAuth.js, social login)  
- **Package Search & Assembly** (Amadeus API, Booking.com API, Haramain scraper)  
- **Comparison & Selection** (tabeloverzicht, sorteeropties, detailpagina’s)  
- **Booking & Payment** (Stripe/Mollie integratie, bevestigingsmails)  
- **Basic Dashboard** (reisoverzicht, documenten, PDF export)  

### 4.2 Advanced Features (4–6 maanden)
- Google Maps integratie (afstand hotel → Haram/Nabawi)  
- Travel intelligence (bagage info, weer, checklist, packing suggestions)  
- Visa support system (formulieren, document upload, status tracking)  
- In-app support (tickets, chat, notificaties)  

### 4.3 Premium Features (7–12 maanden)
- Smart pricing & alerts (historische data, notificaties)  
- Group travel management (split payments, group chat)  
- Advanced analytics & personalization  
- Mobile app (React Native, offline documenten, push notificaties)  

---

## 5. Technical Architecture

### 5.1 Technology Stack
**Frontend:** Next.js 14, Tailwind, shadcn/ui, Zustand/React Query  
**Backend:** FastAPI of Next.js API Routes, PostgreSQL (Prisma ORM), Redis, Celery/Bull  
**Integrations:** Amadeus API, Booking.com Affiliate API, Haramain Scraper, Google Maps API, Stripe/Mollie, SendGrid  
**Infrastructure:** Vercel (frontend), Railway (backend), Supabase/Railway DB, Sentry monitoring  

### 5.2 Database Schema (Core Tables)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR,
    full_name VARCHAR,
    phone VARCHAR,
    passport_number VARCHAR,
    passport_expiry DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE packages (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    departure_city VARCHAR NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE NOT NULL,
    adults INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    status VARCHAR DEFAULT 'draft',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

_(+ flight_options, hotel_options, railway_options as in draft)_

### 5.3 API Endpoints
- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`  
- **Packages:** `/api/packages/search`, `/api/packages/create`, `/api/packages/{id}`  
- **Booking:** `/api/bookings/create`, `/api/bookings/{id}/payment`  
- **External Data:** `/api/flights/search`, `/api/hotels/search`, `/api/railway/search`  

---

## 6. Revenue Model & Business Logic

### Primary Revenue
- Affiliate commissions (Booking.com 3–7%, Amadeus fee, Railway markup 5–10%)  
- Service fees (€5–15 per pakket)  
- Premium subscription (€9.99/maand)  

### Secondary Revenue
- Visa services (€25 processing fee)  
- Travel insurance referrals  
- Airport transfer partner commissions  
- Sponsored hotel/service listings  

---

## 7. Security & Compliance
- **GDPR compliant** (EU users)  
- **PCI DSS compliant** (Stripe payments)  
- Data encryptie (AES-256, HTTPS/TLS)  
- Secure API auth (JWT tokens)  
- Saudi Arabia visa requirements  

---

## 8. Development Roadmap

### Phase 1 (0–3 maanden) – MVP
- Auth, core search, booking, dashboard  
- Payment integration  
- Railway scraper  

### Phase 2 (4–6 maanden) – Advanced
- Google Maps & location services  
- Visa support system  
- Mobile responsiveness  
- Travel intelligence features  

### Phase 3 (7–12 maanden) – Scale
- Premium subscription tier  
- Mobile app (React Native)  
- Advanced analytics & personalization  
- Market expansion  

---

## 9. Success Metrics & KPIs
**Technical:** API response <500ms, uptime 99.9%, search success >95%  
**Business:** MAU, Conversion rate, ARPU, CAC, NPS  
**UX:** Booking time <15min, session duration, feature adoption  

---

## 10. Risk Assessment & Mitigation
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| API rate limits | High | Likely | Fallback APIs, caching |
| Scraper breaks | Medium | Likely | Error handling, manual fallback |
| Affiliate terms change | High | Possible | Diversify partners |
| Regulatory changes | High | Possible | Ongoing compliance review |

---

## 11. Appendices

### Competitive Analysis
- **Booking.com:** Groot, maar geen Umrah focus  
- **Expedia:** Generiek, geen religieuze niche  
- **IslamicTravel:** Niche, maar lage tech-stack  
- **Lokale reisbureaus:** Hoge prijzen, weinig transparantie  

### Glossary
- **Package:** Gecombineerde vlucht, hotel en transport deal  
- **Affiliate:** Commission-based partner verkoop  
- **Haramain Railway:** Sneltrein tussen Jeddah–Makkah–Madinah  
