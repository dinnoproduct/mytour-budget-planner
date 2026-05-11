# Component Scaffolding

You are scaffolding a **new component** for this project. Your job is to generate it correctly — following the exact patterns already used in this codebase — so it fits naturally and does not require rewrites.

The user will tell you what to build (e.g. "scaffold a PriceTag feature component" or "create a new widget for hotel reviews"). If they haven't told you the component name and layer yet, ask before proceeding.

---

## Step 1 — Determine the layer

Ask yourself (or the user) where this component belongs:

| Layer | Path | Use when… |
|---|---|---|
| `entities/` | `src/entities/<domain>/` | It owns business data (API calls, models, domain hooks) |
| `features/` | `src/features/<FeatureName>/` | It's a reusable UI feature that can appear in multiple widgets |
| `widgets/` | `src/widgets/<WidgetName>/` | It's a large section of a page, composed from features/entities |
| `views/` | `src/views/<PageName>/` | It's a top-level page container, used by `app/[locale]/` |
| `shared/ui/components/` | `src/shared/ui/components/<Name>/` | It's a design-system primitive with no business logic |

**Import rules** (never violate):
- `features` may import from `entities` and `shared` — never from `widgets` or `views`
- `widgets` may import from `features`, `entities`, and `shared` — never from `views`
- `views` may import from `widgets`, `features`, `entities`, and `shared`
- `entities` may only import from `shared`

---

## Step 2 — Determine the sub-structure

For `entities/<domain>/` components, use this structure:
```
src/entities/<domain>/
  api/          ← service classes + use-cases
  model/        ← TypeScript types and interfaces
  hooks/        ← TanStack Query hooks wrapping services
  ui/           ← React components for this domain
  providers/    ← Context providers if needed
  helpers/      ← Pure functions
  index.ts      ← barrel export (public API of this entity)
```

For `features/<FeatureName>/` and `widgets/<WidgetName>/`:
```
src/features/<FeatureName>/
  ui/
    index.tsx   ← main component
  index.ts      ← barrel export
```

For `shared/ui/components/<Name>/`:
```
src/shared/ui/components/<Name>/
  index.tsx     ← component
  theme.ts      ← Chakra theme override (if needed)
```

---

## Step 3 — Scaffold the component file

Follow these exact patterns from the codebase:

### Pattern A: Shared UI component (design-system level)
```tsx
import { forwardRef } from 'react'
import { Box, BoxProps } from '@chakra-ui/react'

export interface MyComponentProps extends BoxProps {
  // add custom props here — keep Chakra props available via spread
  variant?: 'primary' | 'secondary'
}

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = 'primary', children, ...props }, ref) => {
    return (
      <Box ref={ref} {...props}>
        {children}
      </Box>
    )
  }
)

MyComponent.displayName = 'MyComponent'
```

Key rules:
- Always `forwardRef` for DOM exposure
- Always spread `{...props}` so callers can pass any Chakra prop
- Export the props interface so callers can extend it
- Set `displayName` for React DevTools

---

### Pattern B: Feature component (business UI)
```tsx
'use client'

import { FC } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Button } from '@ui'  // ← always from @ui, not from @chakra-ui/react
import { useTranslation } from 'react-i18next'

interface MyFeatureProps {
  // explicit props — no spreading Chakra props at this level
}

export const MyFeature: FC<MyFeatureProps> = ({ }) => {
  const { t } = useTranslation()

  return (
    <Box>
      {/* compose using @ui components, not raw Chakra primitives for interactive elements */}
    </Box>
  )
}
```

Key rules:
- `'use client'` if it uses hooks, state, or event handlers
- Import interactive components (`Button`, `Input`, `Alert`, etc.) from `@ui`, not from `@chakra-ui/react`
- Use `Box`, `Flex`, `Stack`, `Grid`, `Text`, `Heading` directly from `@chakra-ui/react` for layout only
- Props interface is explicit — do not spread Chakra props at feature/widget level

---

### Pattern C: Widget component (page section)
```tsx
'use client'

import { FC } from 'react'
import { Box } from '@chakra-ui/react'
import { CardSectionLayout } from '@shared/ui/layout'
import { SomeFeature } from '@features/SomeFeature'
import { useRecoilValue } from 'recoil'
import { someAtom } from '@/modules/packages/store/store'

interface MyWidgetProps {
  // minimal props — widgets get most data from Recoil or hooks
}

export const MyWidget: FC<MyWidgetProps> = ({}) => {
  const data = useRecoilValue(someAtom)

  return (
    <CardSectionLayout title="Section Title">
      <SomeFeature />
    </CardSectionLayout>
  )
}
```

---

### Pattern D: TanStack Query hook (for entity data)
```tsx
import { useQuery, useMutation } from '@tanstack/react-query'
import { SomeService } from '../api/SomeService'

export function useSomeData(params: SomeParams) {
  return useQuery({
    queryKey: ['some-data', params],
    queryFn: () => SomeService.getItems(params),
    enabled: Boolean(params.id),
  })
}

export function useCreateSomething() {
  return useMutation({
    mutationFn: (input: CreateInput) => SomeService.create(input),
  })
}
```

---

### Pattern E: Service class (for entity API)
```tsx
import axios from 'axios'

class SomeService {
  private baseURL = `${process.env.NEXT_PUBLIC_API_URL}/V2/SomePath/`

  private async request<T>(config: Parameters<typeof axios>[0]): Promise<T> {
    const instance = axios.create({ baseURL: this.baseURL })
    instance.interceptors.response.use((r) => r.data)
    return instance(config) as Promise<T>
  }

  async getItems(params: GetItemsParams): Promise<ItemEntity[]> {
    return this.request({ method: 'GET', url: '', params })
  }

  async createItem(data: CreateItemInput): Promise<ItemEntity> {
    return this.request({ method: 'POST', url: '', data })
  }
}

export default new SomeService()
```

---

## Step 4 — Scaffold the barrel export

Every component directory needs an `index.ts` that defines its public API:

```ts
// features/MyFeature/index.ts
export { MyFeature } from './ui'
export type { MyFeatureProps } from './ui'
```

For entities, only export what other layers need — keep internals private:
```ts
// entities/package/index.ts
export { usePackageList, useSearchPackage } from './hooks'
export { PackageService } from './api'
export type { PackageEntity, SearchParams } from './model'
// do NOT export internal helpers or sub-service classes
```

---

## Step 5 — Localization

If the component has any user-visible text:
- Never hardcode strings. Always use `useTranslation()`.
- Add the key to all three locale files: `src/shared/locales/hy.json`, `en.json`, `ru.json`.
- Key naming: `camelCase`, namespaced by feature — e.g. `"packageCard.nightsLabel"`.

---

## Step 6 — Responsive props

Use Chakra's responsive syntax with the project's custom breakpoints:

```tsx
// ✓ correct
<Box fontSize={{ base: '14px', sm: '16px', md: '18px' }} />
<Grid templateColumns={{ base: '1fr', smd: '1fr 1fr', md: 'repeat(3, 1fr)' }} />

// ✗ wrong — don't use arbitrary px media queries in JSX
```

Breakpoint reference: `base` (0) → `xs` (576px) → `sm` (768px) → `smd` (1024px) → `md` (1280px) → `lg` (1440px)

---

## Step 7 — Output

Generate:
1. The main component file with correct content
2. The `index.ts` barrel file
3. Any translation keys to add (as a JSON snippet for each locale)
4. A short note if a Recoil atom or TanStack Query hook needs to be added separately

After generating, run the **Design Token Validator** check (`/token-validator`) on the output to make sure no raw color codes or hardcoded sizes slipped in.
