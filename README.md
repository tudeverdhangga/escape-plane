# ✈️ EscapePlane - Flight Booking System

A modern flight booking application built with Next.js, featuring real-time seat selection, secure payments with Midtrans, and a beautiful user interface.

![EscapePlane Logo](./public/assets/images/logos/logo.svg)

## 🌟 Features

- **Flight Search & Booking**: Search flights by departure/arrival cities and dates
- **Real-time Seat Selection**: Interactive seat map with different class options (Economy, Business, First Class)
- **Secure Authentication**: User registration and login with Lucia Auth
- **Payment Integration**: Secure payments powered by Midtrans
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI Components**: Built with Radix UI and custom components
- **Database Management**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.4.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Custom UI Components
- **Icons**: Lucide React
- **Animations**: Custom CSS animations
- **State Management**: TanStack Query (React Query)
- **Notifications**: Sonner

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Lucia Auth
- **Payment**: Midtrans Integration
- **API**: Next.js API Routes

### Development Tools
- **Linting**: ESLint
- **Package Manager**: npm/yarn/pnpm
- **Database Seeding**: Custom seed script

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Midtrans account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd escape-plane
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/escapeplane"
   
   # Midtrans Configuration
   MIDTRANS_SERVER_KEY="your-midtrans-server-key"
   MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
   MIDTRANS_IS_PRODUCTION="false"
   
   # NextAuth (if applicable)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed the database (optional)
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
escape-plane/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (home)/           # Main application pages
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   ├── generated/
│   │   └── prisma/           # Generated Prisma client
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── public/
│   └── assets/               # Static assets
├── components.json           # Shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🗺️ Application Flow

1. **Home Page**: Search for flights by selecting departure/arrival cities and dates
2. **Flight Results**: Browse available flights with pricing and details
3. **Seat Selection**: Choose seats from an interactive seat map
4. **Authentication**: Sign in or create an account
5. **Checkout**: Review booking details and proceed to payment
6. **Payment**: Secure payment processing with Midtrans
7. **Confirmation**: Booking confirmation and ticket details

## 💳 Payment Integration

The application integrates with Midtrans for secure payment processing:

- **Supported Methods**: Credit/Debit Cards, Bank Transfers, E-wallets
- **Security**: PCI DSS compliant
- **Real-time Updates**: Transaction status updates via webhooks
- **User Experience**: Seamless payment flow with proper error handling

## 🎨 UI Components

Built with a custom design system featuring:

- **Consistent Branding**: Purple theme with custom color palette
- **Accessibility**: ARIA-compliant components
- **Responsive Design**: Mobile-first approach
- **Loading States**: Skeleton loaders and loading indicators
- **Toast Notifications**: User feedback with Sonner

## 🛡️ Security Features

- **Authentication**: Secure user sessions with Lucia Auth
- **Password Hashing**: bcrypt for password security
- **SQL Injection Protection**: Prisma ORM with type safety
- **Environment Variables**: Sensitive data protection
- **CSRF Protection**: Built-in Next.js security features

## 📊 Database Schema

Key entities:
- **Users**: Customer accounts and profiles
- **Flights**: Flight information and scheduling
- **Airplanes**: Aircraft details and configurations
- **Seats**: Seat layouts and availability
- **Tickets**: Booking records and status
- **Sessions**: User authentication sessions

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

### Code Quality

- **ESLint**: Configured with Next.js and TypeScript rules
- **TypeScript**: Strict type checking enabled
- **Prisma**: Type-safe database queries
- **Component Structure**: Organized and reusable components

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Purple color scheme
- Custom fonts (Poppins)
- Responsive breakpoints
- Animation utilities

### Next.js
Optimized configuration:
- App Router
- Image optimization
- API routes
- TypeScript support

## 🚦 API Routes

- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/flights` - Search flights
- `POST /api/transactions/create` - Create booking
- `POST /api/transactions/update` - Update transaction status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Midtrans for payment processing
- Radix UI for accessible components
- Tailwind CSS for the utility-first CSS framework

---

Built with ❤️ using Next.js and TypeScript
