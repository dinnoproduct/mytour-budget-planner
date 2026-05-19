# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Dev server on port 5173 (webpack bundler)
npm run build          # Production build (webpack)
npm run lint           # ESLint
npm run test           # Vitest (node env)
npm run test:coverage  # V8 coverage → lcov report
```

TypeScript build errors are **intentionally ignored** (`typescript.ignoreBuildErrors: true` in `next.config.ts`). ESLint uses Prettier: no semicolons, single quotes, no trailing commas.

---

## Architecture

Travel booking platform built with Next.js 16 + React 19, deployed to Azure Container Registry.

### Layer Order (strict — import only downward)

```
entities  →  features  →  widgets  →  views  →  app/[locale]
                   ↑ all layers can import from shared ↑
```

| Layer | Path | Role |
|---|---|---|
| `entities/` | `src/entities/` | Domain business logic: `package`, `user`, `blog`, `notification` |
| `features/` | `src/features/` | Reusable UI feature components (DatePicker, PackageCard, PackageFilter…) |
| `widgets/` | `src/widgets/` | Composed page sections (Header, BookingFlow, PackageDetails…) |
| `views/` | `src/views/` | Page-level containers (one per route) |
| `shared/` | `src/shared/` | UI foundation, utilities, configs, translations |
| `components/` | `src/components/` | Legacy global components (Modal, Loader, etc.) |
| `modules/` | `src/modules/` | Package-search orchestration + Recoil store |

### Path Aliases (tsconfig)

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `@entities/*` | `src/entities/*` |
| `@features/*` | `src/features/*` |
| `@widgets/*` | `src/widgets/*` |
| `@shared/*` | `src/shared/*` |
| `@components/*` | `src/components/*` |
| `@pages/*` | `src/views/*` |
| `@app/*` | `src/app-legacy/*` |
| `@ui` | `src/shared/ui` |
| `@foundation/*` | `src/shared/ui/foundation/*` |

---

## Routing & Localization

All routes live under `src/app/[locale]/` supporting `hy` (Armenian, default), `en`, `ru`.

- **Middleware** (`src/proxy.ts`): rewrites bare paths → `/hy/…`; 301-redirects legacy prefixes `/arm`, `/eng`, `/rus`
- **Locale validation**: `src/app/[locale]/layout.tsx` falls back to `hy` for unknown locales
- **i18n config**: `src/shared/configs/i18next.ts` — custom path-based detector, merges main + faq + terms namespaces
- **Translations**: JSON files in `src/shared/locales/` (`hy.json`, `en.json`, `ru.json`, plus `faq-*.json`, `terms-*.json`)
- **Navigation**: always use `LanguageLink` (wraps Next.js `Link`) and `useLanguageNavigate` hook to preserve locale prefix

---

## UI System (Chakra UI)

### Theme

**Entry point**: `src/shared/ui/foundation/ThemeProvider/theme.ts` — calls `extendTheme()` merging colors, typography, and 14+ component overrides.

**Breakpoints** (custom, non-standard names):

| Token | px |
|---|---|
| `base` | 0 |
| `xs` | 576 |
| `sm` | 768 |
| `smd` | 1024 |
| `md` | 1280 |
| `lg` | 1440 |

**Colors** (`src/shared/ui/foundation/Colors/theme.ts`):
- Gray scale: `gray.50` – `gray.900`
- Brand: `blue.50` – `blue.900`, `red.500/700`, `green.500/600`, `orange.50/500`
- Card gradients: `gr_Packages`, `gr_Hotel`, `gr_GroupTours` (linear-gradient tokens used on card backgrounds)

**Typography** (`src/shared/ui/foundation/Typography/theme.ts`):
- Font: `"Noto Sans Armenian"` globally
- Text variants: `text-xs` through `text-6xl`
- Heading variants: `heading-sm-xs` through `heading-lg-4xl` — all responsive (base / lg breakpoints)
- `<Text>` defaults: `color="gray.800"`, normal weight; `<Heading>` defaults: `color="gray.800"`, bold

**Icon** (`src/shared/ui/foundation/Iconography/index.tsx`): wraps `react-icomoon` in a Chakra `Box`, accepts `color` (via `themeColor()` helper) and `size` props.

### Shared UI Components (`src/shared/ui/components/`)

25 components — always import from `@ui` barrel or `@shared/ui`:

| Component | Key props / notes |
|---|---|
| **Button** | `variant`: `solid-blue`, `solid-gray`, `solid-red`, `outline-blue`, `outline-red`, `text-blue` · `size`: `lg/md/sm/xs` · `icon`, `iconBefore`, `iconAfter` · `href` (native) or `to` (Next.js Link) |
| **Input** | Wraps `InputGroup` + `FormControl` · `state`: `default`, `disabled`, `error`, `success` · `leftIconName`, `rightIconName`, `prefix`, `suffix`, `label`, `helperText` |
| **Alert** | `status`: `success/error/warning/info` → maps to `green/red/orange/blue` border + icon |
| **Badge** | 7 variants: `HotelStarBadge`, `StatusOnImageBadge`, `StartDateBadge`, `SearchTabBadge`, `DotBadge`, `GroupTourTagBadge`, `GroupTourDayBadge` |
| **Container** | `variant="brand"` → max-width 1440px with responsive padding |
| **SnackBar** | Toast notification; `success` / `error` status with icon |
| **Modal** | Chakra Modal with custom theme override |
| **Tabs** | Responsive variant styling |
| **Skeleton / SkeletonCircle / SkeletonText** | Loading states |
| **Radio / RadioCard** | `RadioCard` for card-style selection |
| **StickySectionNav** | Section navigation with sticky positioning |
| **Form** | `FormControl` wrapper with label, helper text, state styling |

**Component conventions**:
- Use `forwardRef` for DOM exposure (Button, Input)
- Spread `{...props}` to allow Chakra prop passthrough
- Responsive values: `{ base: '…', md: '…', lg: '…' }` syntax
- Avoid `sx` for simple spacing — prefer direct Chakra props

### Layout Components (`src/shared/ui/layout/`)

| Component | Purpose |
|---|---|
| `PageLayout` | Full-page `Flex` column · optional Header/Footer · `minHeight="100dvh"` |
| `CardSectionLayout` | White card with border, rounded corners, title slot, before-title slot for nav |
| `PackageDetailsLayout` | Outer wrapper for package details page |
| `PackageDetailsHeader` | Sticky header for package details with section anchors |

**Layout tips**: always set `minH={0}` on flex children that scroll; use `scrollMarginTop` on anchor sections to offset sticky header height.

---

## State Management

### Provider Composition (`src/app/providers.tsx`)

```
CacheProvider (Chakra/Next.js SSR)
  └─ ChakraProvider (custom theme)
       └─ QueryClientProvider (staleTime: 60 000ms, no refetchOnWindowFocus)
            └─ RecoilRoot (+ React 19 compat patch)
                 └─ UserProvider (auth context)
                      └─ ModalProvider (modal registry context)
                           └─ PackagesSearchProvider
                                └─ HotelPackagesSearchProvider
```

**React 19 + Recoil**: `src/shared/lib/recoilReact19Compat.ts` patches Recoil by exposing React internals through a proxy — must be imported before RecoilRoot.

### Recoil Atoms (`src/modules/packages/store/store.ts`)

Key atoms (use `useRecoilValue`, `useSetRecoilState`, `useRecoilState`):

| Atom | Type | Purpose |
|---|---|---|
| `packagesAtom` | `TPackages[]` | Full package list |
| `filteredPackagesAtom` | `TPackages[]` | Post-filter results |
| `packageDetailsAtom` | `IPackage` | Currently viewed package |
| `packageTravelDetailsAtom` | `IPackageTravelDetails` | Selected dates/travelers |
| `citiesAtom` | `TCities[]` | Available cities |
| `availableFlightsAtom` | `TFlights[]` | Outbound flights |
| `returnFlightsAtom` | `TFlights[]` | Return flights |
| `flightByDateAtom` | `TFlights[]` | Flights filtered by date |
| `dictionaryAtom` | `atomFamily<DictionaryTypes>` | Food types, ticket classes, etc. |
| `generatedOffersAtom` | `IGeneratedOffer[]` | Search-generated offers |
| `generatedMultivendorOffersAtom` | `IGeneratedMultivendorOffer[]` | Hotel multi-vendor offers |
| `userTokenAtom` | `string` | Auth Bearer token |
| `bookingContextAtom` | `BookingContext \| null` | Booking flow state |
| `selectedPackageAtom` | `PackageEntity \| null` | Package selected for booking |
| `bookingDrawerAtom` | `{ isOpen, selectedMealPlan, selectedRoomOffer }` | Hotel booking drawer |
| `preventSideModalCloseAtom` | `boolean` | Prevent modal close from outside click |
| `isLateCheckoutAtom` | `boolean` | Late checkout option |
| `groupsAtom` | `GroupTourEntity[]` | Group tour list |

---

## Data Fetching

### Service Class Pattern

Each entity domain has Axios-based service classes under `entity/api/`:

```ts
class PackageService {
  private request<T>(config): Promise<T> {
    const instance = axios.create({ baseURL })
    instance.interceptors.response.use(r => r.data)  // unwrap response
    return instance(config)
  }
  getPackageList() { … }
  generateOffers(input, params) { … }   // POST /V2/package/generateOffers
}
```

- API versioning: `/V2/` (current), `/v1/` (legacy)
- Auth: `Authorization: Bearer <token>` header on protected endpoints
- Base URL: `NEXT_PUBLIC_API_URL` env var
- Each service creates its Axios instance (no shared singleton)

### Use-Case Orchestrators

`PackageUseCases` (`src/entities/package/api/PackageUseCases.ts`) composes multiple services for complex flows (e.g., search → generate offers → select flight). Call use-cases from hooks, not directly from components.

### TanStack Query Hooks

Custom hooks under each entity's `hooks/` folder wrap service calls:

```ts
// entities/package/hooks/useSearchPackage.ts
export function useSearchPackage(params) {
  return useQuery({ queryKey: ['search', params], queryFn: () => PackageService.search(params) })
}
```

Global config: `staleTime: 60_000`, `refetchOnWindowFocus: false`.

---

## Modal System

**ModalProvider** (`src/app-legacy/providers/ModalProvider/index.tsx`): context + `useReducer` pattern.

- **Registry**: `auth`, `travelers`, `payment`, `paymentSuccess`, `requestCancel`, `profileDetails`, `paymentError` → mapped to their widget components
- **Actions**: `'open'`, `'update'`, `'close'`
- **Chakra integration**: uses `useDisclosure` for `isOpen/onOpen/onClose`

**Legacy custom Modal** (`src/components/Modal/Modal.tsx`): SCSS-based (`.edit-wrapper`, `.edit-inner`), handles outside-click via `useOtsideClick` hook, reads `preventSideModalCloseAtom` before closing.

---

## Key Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Primary API base (V2 endpoints) |
| `NEXT_PUBLIC_API_URL_OLD` | Legacy API endpoint |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps embed in package details |
| `NEXT_PUBLIC_APP_ENV` | Environment flag: `stage`, `staging`, `test`, `qa` |

---

## Global Styles

- **`src/app/globals.css`**: font (`"Noto Sans Armenian"`), button/input reset, `.container` max-width 1170px (responsive padding 32px → 16px), Slick carousel import
- **`src/styles/`**: SCSS utilities — `common.scss` (`.pointer`, `.ellipsis`, ReactModal overrides), `helper.scss`, spacing/display utilities
- **Sass include paths** rooted at `src/` — import SCSS as `@use 'styles/variables'` without the full path

---

## Testing

- **Framework**: Vitest (node environment)
- **Coverage scope**: `src/shared/utils/**/*.ts` only (V8 provider → lcov)
- **Test files**: `**/*.test.ts` / `**/*.test.tsx`
- Existing tests: `PromoCodeService`, `SearchService`, `RequestServiceV2`, `useLanguageRouting`
