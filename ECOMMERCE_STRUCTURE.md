# Bixlay - Ecommerce Clothing Store Structure

## Overview

Complete ecommerce clothing website structure built with Next.js 16, React, TypeScript, Tailwind CSS, and Supabase. The application includes product browsing, shopping cart, checkout, and an admin dashboard.

## Project Structure

### Core Directories

```
/app                    # Next.js app directory
├── layout.tsx          # Root layout with fonts and metadata
├── page.tsx            # Home page
├── globals.css         # Global styles and design tokens
├── products/
│   ├── page.tsx        # Product listing with filters
│   └── [id]/
│       └── page.tsx    # Individual product detail page
├── cart/
│   └── page.tsx        # Shopping cart page
├── checkout/
│   └── page.tsx        # Checkout page
└── admin/
    ├── page.tsx        # Admin dashboard
    ├── products/
    │   └── page.tsx    # Admin product management
    └── orders/
        └── page.tsx    # Admin order management

/components             # Reusable React components
├── header.tsx          # Navigation header with cart icon
├── footer.tsx          # Site footer with links
├── hero.tsx            # Hero section on home page
├── featured-products.tsx    # Featured products grid
├── newsletter.tsx      # Newsletter subscription form
├── product-grid.tsx    # Product listing grid
├── product-filter.tsx  # Product filtering sidebar
├── product-detail.tsx  # Single product details page
├── related-products.tsx # Related products section
├── cart-content.tsx    # Shopping cart management
├── checkout-form.tsx   # Checkout form with payment
└── admin/
    ├── admin-layout.tsx        # Admin sidebar layout
    ├── admin-dashboard.tsx     # Dashboard stats and orders
    ├── admin-products.tsx      # Product management table
    └── admin-orders.tsx        # Order management table

/public                # Static assets
/scripts               # Database initialization scripts
```

## Key Features

### 1. Frontend Pages

**Home Page** (`/`)
- Hero section with call-to-action
- Featured products showcase
- Newsletter signup
- Responsive design

**Products Page** (`/products`)
- Product grid with search
- Filter sidebar (category, price, size, color)
- Sort options
- Product cards with quick actions

**Product Detail** (`/products/[id]`)
- Product images and description
- Color and size selection
- Quantity selector
- Product specifications
- Related products section
- Rating and reviews display

**Shopping Cart** (`/cart`)
- Cart items list
- Quantity adjustment
- Item removal
- Order summary with totals
- Shipping cost calculation
- Proceed to checkout button

**Checkout** (`/checkout`)
- Shipping information form
- Payment information form
- Order summary
- Trust badges

### 2. Admin Dashboard

**Dashboard** (`/admin`)
- Revenue and order statistics
- Recent orders table
- Growth metrics
- Quick overview

**Products Management** (`/admin/products`)
- Product inventory table
- Add/Edit/Delete products
- Category filter
- Stock level indicators
- Search functionality

**Orders Management** (`/admin/orders`)
- Order list with customer details
- Order status management
- Amount and date tracking
- Status filters
- Summary statistics

## Database Schema

### Tables Structure

**products**
- `id` (UUID): Primary key
- `name` (VARCHAR): Product name
- `description` (TEXT): Product description
- `price` (DECIMAL): Product price
- `image_url` (VARCHAR): Product image URL
- `category` (VARCHAR): Product category
- `sizes` (ARRAY): Available sizes
- `colors` (ARRAY): Available colors
- `stock` (INTEGER): Current stock quantity
- `created_at`, `updated_at`: Timestamps

**cart_items**
- `id` (UUID): Primary key
- `session_id` (VARCHAR): User session
- `product_id` (UUID): Foreign key to products
- `quantity` (INTEGER): Item quantity
- `size`, `color` (VARCHAR): Selected options

**orders**
- `id` (UUID): Primary key
- `session_id` (VARCHAR): User session
- `total_price` (DECIMAL): Order total
- `status` (VARCHAR): Order status
- `customer_email`, `customer_name` (VARCHAR): Customer info
- `shipping_address` (TEXT): Delivery address

**order_items**
- `id` (UUID): Primary key
- `order_id` (UUID): Foreign key to orders
- `product_id` (UUID): Foreign key to products
- `quantity` (INTEGER): Item quantity
- `price` (DECIMAL): Item price at purchase
- `size`, `color` (VARCHAR): Ordered options

## Design System

### Color Palette
- **Background**: Cream/Beige (`oklch(0.98 0.005 70)`)
- **Foreground**: Dark Gray/Black (`oklch(0.18 0.02 0)`)
- **Primary**: Dark color for headings and buttons
- **Secondary**: Light gray for backgrounds
- **Accent**: Golden/Brown tone for highlights
- **Muted**: Neutral grays for supporting text

### Typography
- **Serif Font**: Playfair Display (headings)
- **Sans Font**: Inter (body text and UI)
- **Mono Font**: Geist Mono (code)

### Layout
- Max-width: 1280px (7xl Tailwind)
- Responsive grid system (1 col mobile, 2 col tablet, 3+ col desktop)
- Flexbox for navigation and card layouts
- Sticky headers and sidebars

## Component Hierarchy

```
Layout (Root)
├── Header (Navigation, Cart)
├── Page Content
│   └── [Page-specific components]
└── Footer (Links, Social)

Admin Layout
├── Sidebar (Navigation)
├── Header (Toggle, User info)
└── Main Content
    └── [Admin components]
```

## Integration Points

### Supabase Integration
- Real-time database for products, orders, cart
- Row Level Security (RLS) for data access
- Authentication (when added)
- Real-time updates for inventory

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Setup Database**
   ```bash
   # Run the SQL migration
   pnpm run db:init
   ```

3. **Configure Environment Variables**
   - Add Supabase and Stripe keys to `.env.local`

4. **Run Development Server**
   ```bash
   pnpm run dev
   ```

5. **Access Admin**
   - Navigate to `/admin` for dashboard
   - Manage products at `/admin/products`
   - Manage orders at `/admin/orders`

## Future Enhancements

- User authentication with Auth.js
- Wishlist functionality
- Product reviews and ratings
- Order tracking
- Email notifications
- Inventory management automation
- Multi-currency support
- Product recommendations (AI-powered)
- Search with filters
- Advanced analytics

## Styling Guidelines

- Use design tokens from `globals.css` for colors
- Apply responsive classes with Tailwind prefixes (`md:`, `lg:`)
- Use semantic HTML elements
- Ensure WCAG contrast ratios for accessibility
- Follow mobile-first design approach

## Notes

- The structure supports guest checkout (no authentication required initially)
- Cart state uses session-based approach
- Images are placeholder areas ready for product images
- All forms have validation ready for backend integration
- Admin dashboard uses demo data (ready for Supabase integration)
- Design follows modern ecommerce best practices
