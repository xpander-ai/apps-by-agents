# Supabase Auth App

A React application with Supabase authentication, featuring a login page, protected routes, and dashboard pages with dummy graphs.

## Features

- 🔐 Supabase Authentication (Login/Signup)
- 🛡️ Protected Routes with middleware
- 📊 Dashboard with dummy charts and metrics
- 📈 Analytics page with traffic and session data
- 📋 Reports page with performance metrics and KPIs
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Authentication**: Supabase
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Setup Instructions

1. **Clone and navigate to the project**:
   ```bash
   cd supabase-auth-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your Supabase project credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Update the `.env` file with your credentials

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout component
│   └── ProtectedRoute.tsx  # Route protection middleware
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   └── supabase.ts         # Supabase client configuration
├── pages/
│   ├── Login.tsx           # Login/signup page
│   ├── Dashboard.tsx       # Main dashboard with charts
│   ├── Analytics.tsx       # Analytics page with metrics
│   └── Reports.tsx         # Reports page with KPIs
├── App.tsx                 # Main app component with routing
└── main.tsx               # App entry point
```

## Pages

### Login Page
- Email/password authentication
- Toggle between login and signup
- Automatic redirect when authenticated

### Dashboard
- Key metrics cards (Revenue, Users, Orders, Growth)
- Revenue line chart
- User growth bar chart

### Analytics
- Traffic sources pie chart
- Session and page views area chart
- Top pages table

### Reports
- Performance metrics with export buttons
- Quarterly performance composed chart
- KPI radial bar chart
- Recent activity feed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build