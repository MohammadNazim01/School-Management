# EduCore — Frontend

React + Vite dashboard for the EduCore School Management System. Designed to feel like a premium SaaS product — dark-mode first, responsive, animated.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** — dev server and build tool
- **Tailwind CSS** — utility-first styling
- **Radix UI** (shadcn/ui) — accessible, unstyled component primitives
- **TanStack Query v5** — server state management and caching
- **Zustand v5** — client state (auth, theme)
- **Framer Motion** — page transitions and micro-animations
- **Recharts** — data visualisations (Area, Bar, Pie, Radar charts)
- **React Router v6** — client-side routing with role-based guards
- **Axios** — HTTP client with request/response interceptors

## Project Layout

```
frontend/src/
├── components/
│   ├── shared/         # DataTable, PageHeader, StatsCard, ChartCard, etc.
│   └── ui/             # shadcn/ui primitives (Button, Input, Dialog, …)
├── layouts/
│   ├── AppSidebar.tsx  # Collapsible sidebar with role-filtered nav
│   ├── DashboardLayout.tsx
│   ├── AuthLayout.tsx  # Split-screen login/register layout
│   └── Navbar.tsx
├── pages/
│   ├── admin/          # Dashboard, Students, Teachers, Classes, Exams, …
│   ├── teacher/        # Dashboard, Attendance, Marks, Timetable
│   └── student/        # Dashboard, Attendance, Results, Fees, Timetable
├── routes/
│   ├── index.tsx       # createBrowserRouter with role-protected groups
│   └── ProtectedRoute.tsx
├── services/           # Typed Axios service layer (one file per module)
├── store/
│   ├── auth.store.ts   # Zustand + persist (token, user, isAuthenticated)
│   └── ui.store.ts     # Zustand + persist (theme, sidebarCollapsed)
├── styles/
│   └── globals.css     # CSS custom properties (dark/light theme variables)
└── types/
    └── index.ts        # Shared TypeScript interfaces
```

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Dev server runs at **http://localhost:3000**

## Environment

The app talks to the backend via `http://localhost:8000/api/v1` (configured in `src/services/api.ts`).

For production, set the API base URL in `src/services/api.ts` or inject it via a build-time env var.

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@school.edu | admin123 |
| Teacher | teacher@school.edu | teacher123 |
| Student | student@school.edu | student123 |

## Design Notes

- Dark mode is the default. Toggle via the sun icon in the navbar — preference is persisted.
- The sidebar collapses to icons on narrow viewports and by clicking the toggle.
- All pages apply a shared `DataTable` component with built-in search, pagination, and row actions.
- Charts use mock/static data on the Dashboard; all tables show real backend data.
