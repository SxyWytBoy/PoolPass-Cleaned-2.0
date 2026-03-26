# PoolPass

PoolPass is a modern web application that allows users to discover and book private or hotel pools in the UK for day use.

## 🌟 Features

- Search by location, date, and number of guests
- Filter pools by:
  - Amenities (e.g., loungers, showers, food & drink)
  - Accessibility
  - Pet-friendliness
  - Time of day and pricing
- Responsive, user-friendly interface

## 🛠 Tech Stack

- **Framework:** Vite + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI)
- **Backend:** Supabase
- **State / Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6
- **Hosting (planned):** Vercel or Render

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/SxyWytBoy/PoolPass-Cleaned-2.0.git
cd PoolPass-Cleaned-2.0
npm install
```

### Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your values (see `.env.example` for the required variables).

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Route-level page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and Supabase client
└── types/         # TypeScript type definitions
```

## 🔐 Environment Variables

See `.env.example` for all required variables. Never commit your `.env` file.

## 📦 Deployment

This project is configured for deployment on Vercel or Render. Set your environment variables in your hosting dashboard before deploying.
