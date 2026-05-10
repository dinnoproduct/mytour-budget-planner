# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install           # install dependencies (Node 20+ required, use package-lock.json)
npm run dev           # dev server on port 5173 (webpack mode)
npm run build         # production build (type errors do NOT fail — see config notes)
npm run lint          # ESLint across project
npm run test          # Vitest test suite (one-shot)
npm run test:coverage # Vitest with V8 coverage report
```

Run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture Overview

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Chakra UI v2 + Emotion · TanStack Query + Recoil · Axios · Sass · i18next · Vitest

### Layer Structure

```
src/
├── app/[locale]/        # App Router — localized route segments (hy/en/ru)
├── app-legacy/          # Legacy providers/styles still in use (@app/* alias)
├── entities/            # Domain layer: API services + use-case orchestrators
│   ├── package/         # PackageUseCases aggregates 10+ services
│   ├── user/            # UserUseCases (auth + profile)
│   ├── blog/            # BlogUseCases
│   └── notification/    # Splash, price-alert, hotel-inquiry services
├── features/            # Reusable product features (DatePicker, SearchCities…)
├── widgets/             # Large UI blocks composed from features/entities
├── views/ & modules/    # Page-level containers and view composition
└── shared/              # Configs, UI primitives, hooks, utilities, locale JSONs
```

### Provider Composition

All providers are composed in [src/app/providers.tsx](src/app/providers.tsx): Chakra UI → TanStack Query → Recoil → UserContext → ModalProvider. When adding a new provider, wire it here.

### Data / API Pattern

Each entity domain exposes:
1. **Service classes** — thin Axios wrappers; each creates an Axios instance with `NEXT_PUBLIC_API_URL` as base URL; response interceptors unwrap `response.data`
2. **Use-case classes** — compose multiple services into higher-level methods (e.g., `PackageUseCases`)
3. **Custom hooks** — TanStack Query hooks that call use-case methods; live in `entities/<domain>/model/`

Do not call services directly from components — go through use-case hooks.

### State Management

| Concern | Tool |
|---------|------|
| Server / async data | TanStack Query (staleTime 60s, no refetch-on-focus) |
| Global client UI state | Recoil atoms |
| Auth / user session | `UserContext` + localStorage token |
| Modal state | Reducer in `app-legacy/providers/ModalProvider/` |
| Forms | React Hook Form + Yup |

Recoil requires a React 19 compat shim at [src/shared/lib/recoilReact19Compat.ts](src/shared/lib/recoilReact19Compat.ts).

### Routing & Localization

- Supported locales: `hy` (Armenian, default), `en`, `ru`
- [src/proxy.ts](src/proxy.ts) (Next.js middleware): rewrites bare paths → `/hy/*`, issues 301s for legacy prefixes (`/arm`, `/eng`, `/rus`)
- [next.config.ts](next.config.ts): mirrors those redirects and configures Sass include paths rooted at `src`
- [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx): validates locale, falls back to `hy`
- Translation keys live in `src/shared/locales/{hy,en,ru}.json`; add keys to all three files when adding copy

### TypeScript Path Aliases (tsconfig.json)

`@components`, `@foundation`, `@ui`, `@widgets`, `@features`, `@shared`, `@entities`, `@app`, `@pages` — prefer these over relative paths.

## Configuration Notes

- `next.config.ts` sets `typescript.ignoreBuildErrors: true` — type errors won't block `npm run build`. Always run `npm run lint` and `npm run test` explicitly to catch issues.
- `.lottie` files are handled as webpack asset resources; no extra setup needed.
- `images.remotePatterns` is broadly open — tighten when adding new image domains.

## Testing

- Test files: `src/**/*.test.ts` and `src/**/*.test.tsx`, environment: `node`
- Coverage is tracked only for `src/shared/utils/**/*.ts` (excludes `index.ts`)
- Tests also exist for services (`entities/*/api/`) and middleware (`src/proxy.ts`) but are outside the coverage scope

## Environment Variables

```
NEXT_PUBLIC_API_URL              # primary API base URL
NEXT_PUBLIC_API_URL_OLD          # legacy API base URL (constants only)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # Google Maps embed key
NEXT_PUBLIC_APP_ENV              # staging detection (stage/staging/test/qa)
```

Set these in `.env.local`.
