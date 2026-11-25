# Yel Aura — Wear Your Aura

A modern, full-stack fashion e-commerce platform built with Next.js 15, Node.js/Express, Prisma ORM, and MySQL.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| State | Zustand, TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | MySQL |
| Images | Cloudinary |
| Payments | Razorpay + Cash on Delivery |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend) + Railway/Render (backend) |

---

## Project Structure

```
yel-aura/
├── frontend/          # Next.js 15 App Router frontend
│   ├── app/           # Pages and layouts
│   ├── components/    # Reusable UI components
│   ├── store/         # Zustand state stores
│   ├── services/      # API service functions
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Axios instance
│   └── types/         # TypeScript types
│
└── backend/           # Express + Prisma backend
    ├── src/
    │   ├── controllers/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── utils/
    └── prisma/        # Schema and migrations
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- Cloudinary account (free tier)
- Razorpay account (free tier)

### 1. Clone and install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure environment variables

**Backend** — copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in:
```env
DATABASE_URL="mysql://user:password@localhost:3306/yel_aura"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend** — copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up the database

```bash
cd backend

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE yel_aura;"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed with sample data
npm run seed
```

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000/api  
Admin panel: http://localhost:3000/admin

### Default Admin Credentials
- Email: `admin@yelaura.com`
- Password: `Admin@123`

---

## Features

### Customer
- Browse products by category, price, size, color
- Product search with live preview
- Product detail with image gallery
- Add to cart / wishlist
- Checkout with Razorpay (UPI/Cards/NetBanking/Wallets) or Cash on Delivery
- Coupon code support
- Order tracking with status timeline
- User profile management

### Admin
- Dashboard with revenue/orders/customer stats
- Product management (CRUD + image upload)
- Category management
- Order management (status updates)
- Customer management
- Coupon management
- Banner management
- Analytics charts (recharts)
- Site settings (store info, social links, SEO)

---

## API Reference

### Auth
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | User |
| PUT | /api/auth/profile | User |
| PUT | /api/auth/change-password | User |

### Products
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/products | Public |
| GET | /api/products/featured | Public |
| GET | /api/products/search | Public |
| GET | /api/products/:slug | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |

### Categories
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Cart
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/cart | User |
| POST | /api/cart | User |
| PUT | /api/cart/:id | User |
| DELETE | /api/cart/:id | User |
| DELETE | /api/cart | User |

### Orders
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | /api/orders | User |
| POST | /api/orders/verify-payment | User |
| GET | /api/orders/my-orders | User |
| GET | /api/orders/:id | User |
| POST | /api/orders/:id/cancel | User |
| GET | /api/orders | Admin |
| PUT | /api/orders/:id/status | Admin |

---

## Deployment

### Frontend → Vercel

1. Push frontend to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → your Railway/Render backend URL
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` → Razorpay key
   - `NEXT_PUBLIC_SITE_URL` → your Vercel domain
4. Deploy

### Backend → Railway

1. Push backend to GitHub
2. Create new project on Railway
3. Add MySQL plugin
4. Set environment variables
5. Set build command: `npm run build`
6. Set start command: `npm start`
7. Run migrations via Railway CLI or dashboard shell

### Backend → Render

1. Create new Web Service on Render
2. Connect GitHub repo
3. Build: `npm install && npm run build && npx prisma migrate deploy`
4. Start: `npm start`
5. Add MySQL (use PlanetScale or Railway MySQL)

---

## License-Free Assets Used

- **Fonts**: Google Fonts (Playfair Display, Inter) — Open Font License
- **Icons**: Lucide React — ISC License
- **UI**: Tailwind CSS — MIT License
- **Images**: Unsplash/Pexels placeholder URLs in seed data (replace with your own)
- All npm packages are MIT or similar permissive licenses

---

## Future Integrations

- Instagram Shop API
- WhatsApp Business API notifications
- AI product recommendations
- Google Analytics 4
- SAP integration
- Loyalty points system
