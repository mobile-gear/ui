# MobileGear UI

Frontend application for MobileGear - E-commerce platform for mobile accessories.

<img width="967" height="559" alt="image" src="https://github.com/user-attachments/assets/e3502c50-5c7e-47b4-ba85-42adc3bb4e1c" />

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM 6
- **Forms**: Formik + Yup
- **Payment**: Stripe
- **Icons**: Heroicons + React Icons
- **Animations**: Framer Motion

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route-level page components
├── routes/          # Route configuration
├── store/           # Redux store and slices
├── services/        # API services
├── hooks/           # Custom React hooks
├── interfaces/      # TypeScript interfaces
├── types/           # Type definitions
├── utils/           # Utility functions
└── assets/          # Static assets
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The development server runs at `http://localhost:3000` with API proxy to `http://localhost:8000`.

## Build

```bash
npm run build
```

Output is generated in the `dist/` directory.

## Testing

### Unit Tests (Vitest)

```bash
npm run test:unit           # Run once
npm run test               # Watch mode
npm run test:unit:coverage # With coverage
```

### E2E Tests (Cypress)

```bash
npm run test:e2e      # Interactive mode
npm run test:e2e:run  # Headless mode
```

### Full Coverage

```bash
npm run coverage
```

## Code Quality

```bash
npm run lint         # ESLint
npm run format       # Prettier
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

## Scripts Reference

| Script      | Description              |
| ----------- | ------------------------ |
| `dev`       | Start development server |
| `build`     | Production build         |
| `preview`   | Preview production build |
| `test`      | Unit tests (watch)       |
| `test:unit` | Unit tests (single run)  |
| `test:e2e`  | E2E tests (interactive)  |
| `coverage`  | Full test coverage       |
| `lint`      | Run ESLint               |
| `format`    | Format with Prettier     |
