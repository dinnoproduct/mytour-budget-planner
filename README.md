# My Tour Frontend

Next.js 16 + React 19 frontend for the My Tour travel platform.
The app includes localized routes (`hy`, `en`, `ru`), package and group
tour flows, booking/payment pages, blogs, FAQ, and user package pages.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Chakra UI + Emotion
- Sass
- Vitest (with V8 coverage)
- ESLint (`eslint-config-next`)

## Prerequisites

- Node.js 20+ (recommended for Next.js 16)
- npm (lockfile is committed as `package-lock.json`)

## Installation

```bash
npm install
```

## Environment Variables

Define these variables in your local environment (for example in
`.env.local`):

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_URL_OLD`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

Only variable names are documented here. Do not commit secret values.

## Running Locally

```bash
npm run dev
```

The dev server is configured to run on port `5173`.

## Available Scripts

All scripts below are taken from `package.json`:

- `npm run dev` - start Next.js dev server (webpack mode, port 5173)
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once
- `npm run test:coverage` - run Vitest with coverage output

## Testing

- Test files are configured as `src/**/*.test.ts` and `src/**/*.test.tsx`.
- Coverage is configured for `src/shared/utils/**/*.ts` (excluding
  `src/shared/utils/index.ts`).
- Coverage reports are generated in `coverage/` (text and lcov reporters).

## Project Structure

High-level layout:

- `src/app` - App Router entrypoints and locale-based routes
- `src/app/[locale]` - localized pages (`hy`, `en`, `ru`)
- `src/widgets`, `src/features`, `src/entities`, `src/shared` - UI and
  domain layers
- `src/views` and `src/modules` - page composition and feature modules
- `src/app-legacy` - legacy code kept alongside current app structure
- `public` - static assets

## Configuration Notes

- `next.config.ts` enables Sass include paths, broad remote image patterns,
  locale redirects (`arm`/`hy`, `eng`/`en`, `rus`/`ru`), and `.lottie` asset
  handling.
- TypeScript build errors are currently ignored in Next.js build config
  (`typescript.ignoreBuildErrors: true`).
