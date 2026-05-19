# Component Compliance Check

You are performing a **Component Compliance Check** on this codebase.

Your job is to find places in new or recently changed code where a developer built UI from scratch instead of reusing the project's existing shared components. This wastes effort and causes visual inconsistencies.

---

## Step 1 — Identify what to check

If the user passed a file path or component name as an argument, check only that. Otherwise:
1. Run `git diff --name-only HEAD` to get recently changed files.
2. Filter to only `.tsx` and `.ts` files inside `src/`.
3. Read each changed file fully before analyzing.

---

## Step 2 — Check each file against these rules

### Rule 1: No raw `<button>` or custom button divs
Look for: `<button`, `onClick` on a `<div>` or `<Box>` that visually acts as a button.

The project has: `Button` from `@ui` — supports variants (`solid-blue`, `outline-blue`, `text-blue`, `solid-gray`, `solid-red`), sizes (`lg`, `md`, `sm`, `xs`), `iconBefore`, `iconAfter`, `icon` (icon-only), `href` (native link), `to` (Next.js Link).

Flag it if someone wrote a custom pressable element instead of using `<Button>`.

---

### Rule 2: No custom text input built from scratch
Look for: raw `<input`, `<ChakraInput>` or `<Input>` imported directly from `@chakra-ui/react` (not from `@ui`).

The project has: `Input` from `@ui` — handles `state` (`default`, `disabled`, `error`, `success`), `label`, `helperText`, `leftIconName`, `rightIconName`, `prefix`, `suffix`. It wraps `FormControl` automatically.

Flag it if someone imported Chakra's Input directly and added their own label/error logic.

---

### Rule 3: No inline alert/notification boxes
Look for: manually styled `<Box>` or `<Flex>` that displays a status message (success, error, warning, info) with color-coded borders or backgrounds.

The project has: `Alert` from `@ui` — accepts `status` (`success`, `error`, `warning`, `info`) and handles icon + color automatically.

---

### Rule 4: No hand-rolled badge/tag elements
Look for: small inline `<Box>` or `<span>` with `borderRadius`, `fontSize`, `backgroundColor` used to label something (hotel stars, status, date, etc.).

The project has: `Badge` from `@ui` with 7 variants — `HotelStarBadge`, `StatusOnImageBadge`, `StartDateBadge`, `SearchTabBadge`, `DotBadge`, `GroupTourTagBadge`, `GroupTourDayBadge`.

---

### Rule 5: No custom modal built with `position: fixed` or `z-index`
Look for: `position="fixed"`, `zIndex`, or `useDisclosure` paired with a manually built overlay `<Box>`.

The project has two modal systems:
- `Modal` from `@ui` — Chakra-based, for standard content modals.
- `ModalProvider` context (`src/app-legacy/providers/ModalProvider/`) — for app-wide modals (`auth`, `travelers`, `payment`, `paymentSuccess`, `requestCancel`, `profileDetails`, `paymentError`). Open them with the `useModal` hook, never build a new overlay.

---

### Rule 6: No custom loading skeleton
Look for: custom blinking/shimmer `<Box>` elements used as loading placeholders.

The project has: `Skeleton`, `SkeletonCircle`, `SkeletonText` from `@ui`.

---

### Rule 7: No custom checkbox, switch, radio
Look for: raw `<input type="checkbox">`, `<input type="radio">`, or custom toggle divs.

The project has: `Checkbox`, `Switch`, `Radio`, `RadioCard` from `@ui`.

---

### Rule 8: No custom tooltip
Look for: hover-triggered absolutely positioned `<Box>` elements.

The project has: `Tooltip` from `@ui`.

---

### Rule 9: No duplicate icon rendering
Look for: `<img src="...icon...">` or raw SVG inline instead of using the Icon component.

The project has: `Icon` from `src/shared/ui/foundation/Iconography/` — accepts `name`, `size`, and `color` (via theme token).

---

### Rule 10: Page layout must use `PageLayout`
Look for: a view or widget that manually composes `<Header>` + `<Footer>` + main content instead of using the `PageLayout` component from `src/shared/ui/layout/`.

---

## Step 3 — Report your findings

For every violation, output a block like this:

```
VIOLATION [Rule N: Rule name]
File:    src/path/to/file.tsx:42
Found:   <Box onClick={...} cursor="pointer" ...>Submit</Box>
Problem: Custom clickable Box used as a button.
Fix:     Replace with <Button variant="solid-blue" onClick={...}>Submit</Button>
Import:  import { Button } from '@ui'
```

If no violations are found in a file, write:
```
✓ src/path/to/file.tsx — no compliance issues
```

---

## Step 4 — Summary

At the end, output:
- Total files checked
- Total violations found
- A priority list: which violations to fix first (prefer violations in shared/reusable components over one-off pages)
