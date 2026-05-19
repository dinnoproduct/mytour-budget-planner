# My Tour Frontend

Next.js 16 + React 19 frontend for the My Tour travel platform.
The application includes localized routes (`hy`, `en`, `ru`), package and
group-tour flows, booking/payment pages, blogs, FAQ, and user package pages.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Chakra UI + Emotion
- TanStack Query + Recoil state management
- Sass
- Vitest (V8 coverage provider)
- ESLint (`eslint-config-next`)

## Prerequisites

- Node.js 20+ recommended
- npm (lockfile is committed as `package-lock.json`)

## Installation

```bash
npm install
```

## Environment Variables

Define these variables in local environment files (for example `.env.local`):

- `NEXT_PUBLIC_API_URL`: primary API base URL used by entity services
  (`package`, `user`, `notification`, etc.)
- `NEXT_PUBLIC_API_URL_OLD`: legacy API base URL reference used by constants
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps embed key for package/hotel
  map widgets

Only variable names are documented here. Do not commit secret values.

## Running Locally

```bash
npm run dev
```

The development server runs on port `5173` in webpack mode.

## Available Scripts

All scripts below are sourced from `package.json`:

- `npm run dev`: start Next.js development server on port `5173`
- `npm run build`: create a production build
- `npm run start`: run the production server
- `npm run lint`: run ESLint across the project
- `npm run test`: run Vitest test suite once
- `npm run test:coverage`: run Vitest with coverage report

## Architecture And Project Structure

High-level layout:

- `src/app`: Next.js App Router root and route segments
- `src/app/[locale]`: localized route tree and page entrypoints
- `src/app-legacy`: legacy app providers/styles still used via TS path alias
  (`@app/*` in `tsconfig.json`)
- `src/entities`: domain entities, API services, use-case composition
- `src/features`: reusable product features
- `src/widgets`: larger UI building blocks composed from features/entities
- `src/modules` and `src/views`: page-level containers and view composition
- `src/shared`: shared config, UI primitives, utilities, locale JSON files

Provider composition is centralized in `src/app/providers.tsx` and wraps the
app with Chakra UI, TanStack Query, Recoil, user context, and modal provider.

## Routing And Localization Behavior

Routing is handled by both `src/proxy.ts` and `next.config.ts`:

- `src/proxy.ts` rewrites non-prefixed paths to default locale `hy`
  (for example `/about` -> `/hy/about`)
- `src/proxy.ts` passes through already localized paths for `en` and `ru`
- `src/proxy.ts` also issues 301 redirects for legacy prefixes:
  `/arm`, `/hy`, `/eng`, `/rus`
- `next.config.ts` contains matching redirect rules for legacy paths
- `src/app/[locale]/layout.tsx` validates locale and falls back to `hy`
- `src/components/I18nInit/I18nInit.tsx` applies locale to `i18next`
- `src/shared/configs/i18next.ts` configures translations for `hy`, `en`, `ru`
  and detects language from URL path

## API And Data Layer Notes

The entity layer uses service classes (mostly Axios-based) and use-case
orchestrators:

- `src/entities/package/api`: package, flight, request, search, promo-code,
  group-tour, and dictionary services aggregated by `PackageUseCases`
- `src/entities/user/api`: auth and user profile services aggregated by
  `UserUseCases`
- `src/entities/blog/api`: blog service wrapped by `BlogUseCases`
- `src/entities/notification/api`: splash notification, price alert, and hotel
  inquiry services

Common pattern:

- each service creates an Axios instance with a base URL from
  `NEXT_PUBLIC_API_URL`
- response interceptors return `response.data`
- use-case classes expose higher-level methods by composing multiple services

## Testing Strategy

Vitest is configured in `vitest.config.ts`:

- test environment: `node`
- test file patterns: `src/**/*.test.ts`, `src/**/*.test.tsx`
- coverage provider: `v8`
- reporters: `text`, `lcov`
- coverage include scope: `src/shared/utils/**/*.ts`
- coverage exclude: `src/shared/utils/index.ts`

Coverage caveat: coverage output currently targets only `src/shared/utils`
files, even though tests also exist under entity/service and proxy layers.

## Build, Docker, And CI

### Production Build

```bash
npm run build
npm run start
```

`next.config.ts` currently sets `typescript.ignoreBuildErrors: true`, so type
errors do not fail the Next.js production build step.

### Docker

`Dockerfile`:

- uses `node:latest`
- installs dependencies with `npm install`
- runs `npm run build`
- starts with `npm start`
- exposes port `3000`

Build locally:

```bash
docker build -t my-tour-frontend .
docker run --rm -p 3000:3000 my-tour-frontend
```

### Azure Pipeline

`azure-pipelines.yml` currently:

- triggers on `dev` branch
- runs `Docker@2` task with `buildAndPush`
- targets Azure Container Registry `dinnomytour.azurecr.io`
- pushes repository `mytourweb` with tag `test`
- contains a commented-out deploy stage template for VM SSH deployment

## Configuration Notes

- `next.config.ts` enables Sass include paths rooted at `src`
- remote image loading is broadly allowed via `images.remotePatterns`
- `.lottie` files are configured as webpack asset resources
- proxy matcher in `src/proxy.ts` excludes `_next` assets and static files

## Troubleshooting

- `npm run build` succeeds despite type errors:
  check `next.config.ts` (`typescript.ignoreBuildErrors: true`) and run
  `npm run lint` and tests explicitly
- localized routes not loading as expected:
  verify path prefix behavior in `src/proxy.ts` and redirects in
  `next.config.ts`
- missing translations:
  confirm keys exist in `src/shared/locales/*.json` and locale is one of
  `hy`, `en`, `ru`
- API calls failing in browser:
  verify `NEXT_PUBLIC_API_URL` and related environment values are set
- map embeds not rendering:
  verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is present and valid
