# VGC Events - Event Ticketing Platform

VGC Events is a modern event ticketing and management platform built specifically for Victoria Garden City. It's inspired by Tix.Africa and provides a seamless experience for both event organizers and attendees.

## 🚀 Features

### For Event Organizers
- **Quick Event Creation**: Create events in less than 10 minutes
- **Flexible Ticketing**: Support for free events, paid events, and invite-only events
- **Real-time Analytics**: Track ticket sales and revenue in real-time
- **Event Management Dashboard**: Manage all your events from one place
- **Custom Branding**: Customize event pages to match your brand
- **Multiple Payment Options**: Accept payments via cards, bank transfers, and more

### For Attendees
- **Easy Discovery**: Browse events by category with powerful search and filters
- **Fast Checkout**: Seamless ticket purchasing experience
- **Mobile Tickets**: Digital tickets accessible from any device
- **Event Reminders**: Get notified about upcoming events
- **Secure Payments**: All transactions are encrypted and secure

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components
- **Package Manager**: npm

## 📦 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vgcevents
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
vgcevents/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── discover/          # Event discovery page
│   │   ├── pricing/           # Pricing page
│   │   ├── how-it-works/      # Features page
│   │   ├── about/             # About page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   └── dashboard/         # Organizer dashboard
│   │       └── create-event/  # Event creation page
│   ├── components/            # Reusable React components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Footer.tsx        # Footer component
│   └── app/
│       ├── layout.tsx        # Root layout
│       └── globals.css       # Global styles
├── public/                   # Static assets
└── package.json             # Dependencies
```

## 🎨 Pages Overview

- **Homepage (`/`)**: Hero section, categories, features, testimonials
- **Discover Events (`/discover`)**: Browse and search events with filters
- **Pricing (`/pricing`)**: Platform pricing and features
- **How It Works (`/how-it-works`)**: Detailed feature breakdown
- **About (`/about`)**: Mission, values, and platform information
- **Login (`/login`)**: User authentication
- **Signup (`/signup`)**: New user registration
- **Dashboard (`/dashboard`)**: Event organizer dashboard
- **Create Event (`/dashboard/create-event`)**: Event creation form

## 🎯 Key Features by Page

### Homepage
- Gradient hero section with CTA
- Event categories (Community, Art & Culture, Sports, Business, Food & Drink)
- Features showcase (Ticketing, Fast Checkout, Analytics, Box Office)
- Testimonials section

### Discover Page
- Category filters
- Search functionality
- Event cards with date, time, location, and price
- Responsive grid layout

### Dashboard
- Event statistics (Total events, tickets sold, revenue)
- Event management interface
- Quick access to create new events

### Create Event Form
- Basic information (title, description, category)
- Date and time selection
- Location details (physical/virtual)
- Ticketing options (free/paid)
- Ticket inventory management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses Tailwind CSS 4 with a custom color scheme:
- Primary: Purple (`purple-600`)
- Secondary: Pink (`pink-500`)
- Accent: Orange (`orange-400`)

## 🚧 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication (NextAuth.js)
- Payment gateway integration (Paystack/Flutterwave)
- Email notifications
- QR code ticket generation
- Event check-in system
- Advanced analytics dashboard
- Social media integration
- Mobile app

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the project owner.

## 📧 Support

For support, email support@vgcevents.com (placeholder) or visit the contact page.

---

Built with ❤️ for Victoria Garden City
