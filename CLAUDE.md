# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 5173 (webpack mode)
npm run build        # Production build (webpack mode)
npm run lint         # ESLint check
npm run test         # Run all tests (Vitest)
npm run test:coverage  # Run tests with V8 coverage report
```

To run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture

This is a **Next.js 16 + React 19 + TypeScript** app following **Feature Sliced Design (FSD)**:

```
src/
├── app/              # Next.js App Router — [locale]/ route tree, root providers, layout
├── app-legacy/       # Legacy providers and styles (imported via @app alias)
├── entities/         # Domain models: user, package, blog, notification
├── features/         # Isolated UI features (PackageFilter, DatePicker, SearchCities, etc.)
├── widgets/          # Composite page blocks (Header, BookingFlow, PackageList, etc.)
├── shared/           # Primitives: ui/, configs/, locales/, utils/, hooks/, types/
├── views/            # Page-level view containers (route leaf components)
├── pages/            # Legacy page components
├── components/       # Legacy shared components (Header, Footer, I18nInit, AuthGuard)
├── hooks/            # Root-level custom hooks
└── services/         # Generic request service
```

**Layer import rule (FSD)**: upper layers may import lower layers only.  
`app → views → widgets → features → entities → shared`

### Entity structure

Each entity in `src/entities/` follows:
```
entity/
├── api/        # Axios services + UseCases orchestrator
├── model/      # TypeScript domain types/interfaces
├── hooks/      # TanStack Query wrappers (useQuery)
└── providers/  # React Context providers (if needed)
```

### State management

| Concern | Tool |
|---|---|
| Server / async state | TanStack Query v5 (`useQuery`, `useMutation`) |
| Global client state | Recoil 0.7.7 (with React 19 compat patch in `src/shared/lib/recoilReact19Compat.ts`) |
| Auth / user session | React Context via `UserProvider` — token persisted in localStorage |
| Local UI state | `useState` |

### API / data layer

Services use Axios instances scoped to a base URL:

```typescript
this.api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_API_URL}/endpoint` })
this.api.interceptors.response.use(res => res.data, err => Promise.reject(err))
```

Entity-level `UseCases` classes (e.g. `PackageUseCases`) compose multiple services and are the preferred entry point for business logic. Hooks call use-cases and wrap them in `useQuery`.

### i18n

Three locales: **hy** (Armenian, default), **en**, **ru**.  
Config: `src/shared/configs/i18next.ts`. Translation files: `src/shared/locales/`.  
Routing is path-based — `src/proxy.ts` (Next.js middleware) handles locale detection and legacy redirects (`/arm` → `/`, `/eng` → `/en`, etc.).  
The dynamic segment `src/app/[locale]/` validates and applies the locale; `I18nInit` component applies it to i18next at runtime.

### Path aliases (tsconfig)

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@shared/*` | `src/shared/*` |
| `@entities/*` | `src/entities/*` |
| `@features/*` | `src/features/*` |
| `@widgets/*` | `src/widgets/*` |
| `@pages/*` | `src/views/*` |
| `@app/*` | `src/app-legacy/*` |
| `@components/*` | `src/shared/ui/components/*` |
| `@foundation/*` | `src/shared/ui/foundation/*` |
| `@ui` | `src/shared/ui/index.ts` |

## Code style

- **No semicolons**, single quotes, 2-space indent, 80-char print width, no trailing commas.
- Arrow functions: omit parens when single param (`x => x`).
- Prettier is enforced via ESLint (`eslint-plugin-prettier`). Run `npm run lint` to check.

## Testing

- Framework: **Vitest** (node environment).
- Coverage scope: `src/shared/utils/**/*.ts` only (V8, text + lcov reporters).
- Test files: `*.test.ts` / `*.test.tsx` anywhere in `src/`.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Primary API base URL |
| `NEXT_PUBLIC_API_URL_OLD` | Legacy API reference |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps embed |
| `NEXT_PUBLIC_APP_ENV` | Environment tag (`stage`/`staging`/`test`/`qa`) |

## Notable build notes

- TypeScript build errors are **ignored** (`ignoreBuildErrors: true` in `next.config.ts`) — do not rely on build-time TS checks; use the editor / `tsc --noEmit` locally.
- `.lottie` animation assets require the custom webpack loader configured in `next.config.ts`.
- Sass `includePaths` is set to `src/`, so partials can be imported without relative paths.
