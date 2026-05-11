# Design Token Validator

You are running the **Design Token Validator**. Your job is to scan code for hardcoded color values and magic sizes that should instead use the project's design tokens (Chakra theme values). Raw values create inconsistency and make theme updates impossible.

---

## Step 1 — Identify what to scan

If the user passed a file path or glob, scan only those files.
Otherwise, scan all recently changed `.tsx`, `.ts`, `.css`, `.scss` files using `git diff --name-only HEAD`.

Read each file fully before analyzing.

---

## Step 2 — Detect violations

### Category 1: Hardcoded hex colors

**Pattern to find**: any hex color literal — `#FFF`, `#ffffff`, `#1A202C`, `#0B69FF`, etc.

**Where to look**:
- Inside JSX props: `color="#1A202C"`, `bg="#E7F0FF"`, `borderColor="#CBD5E0"`
- Inside `sx={{}}` objects: `sx={{ color: '#718096' }}`
- Inside CSS/SCSS: `color: #4A5568;`, `background: #F7FAFC`
- Inside `style={{}}` objects: `style={{ backgroundColor: '#fff' }}`

**Token map** — replace raw hex with these Chakra tokens:

| Raw hex | Token | Usage |
|---|---|---|
| `#FFF` / `#ffffff` / `#FFFFFF` | `white` | |
| `#000` / `#000000` | `black` | |
| `#F7FAFC` | `gray.50` | Lightest background |
| `#EDF2F7` | `gray.100` | Subtle background |
| `#E2E8F0` | `gray.200` | Borders, dividers |
| `#CBD5E0` | `gray.300` | Muted borders |
| `#A0AEC0` | `gray.400` | Placeholder text |
| `#718096` | `gray.500` | Secondary text |
| `#4A5568` | `gray.600` | Body text |
| `#2D3748` | `gray.700` | Dark text |
| `#1A202C` | `gray.800` | Heading text (default) |
| `#171923` | `gray.900` | Near-black |
| `#E7F0FF` | `blue.50` | Light blue bg |
| `#CEE1FF` | `blue.100` | |
| `#9DC3FF` | `blue.200` | |
| `#5496FF` | `blue.300` | |
| `#3C87FF` | `blue.400` | |
| `#0B69FF` | `blue.500` | Primary brand blue |
| `#0050E5` | `blue.600` | |
| `#0036CC` | `blue.700` | |
| `#001DB2` | `blue.800` | |
| `#00004D` | `blue.900` | |
| `#05CA6C` | `green.500` | Success / positive |
| `#00AE4E` | `green.600` | |
| `#FF254C` | `red.500` | Error / destructive |
| `#E50B32` | `red.600` | |
| `#B20000` | `red.700` | |
| `#FFF4E9` | `orange.50` | Light orange bg |
| `#FF8F27` | `orange.500` | Warning / accent |

For any hex that doesn't match the table, note it as **unknown token — check with designer**.

---

### Category 2: Hardcoded rgba() / rgb() colors

**Pattern to find**: `rgba(...)` or `rgb(...)` inside JSX props, `sx`, `style`, CSS/SCSS.

**Token map** for known values:

| Raw value | Token |
|---|---|
| `rgba(255,255,255,0.04)` | `whiteAlpha.50` |
| `rgba(255,255,255,0.06)` | `whiteAlpha.100` |
| `rgba(255,255,255,0.08)` | `whiteAlpha.200` |
| `rgba(255,255,255,0.16)` | `whiteAlpha.300` |
| `rgba(255,255,255,0.24)` | `whiteAlpha.400` |
| `rgba(255,255,255,0.36)` | `whiteAlpha.500` |
| `rgba(255,255,255,0.48)` | `whiteAlpha.600` |
| `rgba(255,255,255,0.64)` | `whiteAlpha.700` |
| `rgba(255,255,255,0.80)` | `whiteAlpha.800` |
| `rgba(255,255,255,0.92)` | `whiteAlpha.900` |
| `#0000000A` / `rgba(0,0,0,0.04)` | `blackAlpha.50` |
| `#0000000F` / `rgba(0,0,0,0.06)` | `blackAlpha.100` |
| `#00000014` / `rgba(0,0,0,0.08)` | `blackAlpha.200` |
| `#00000029` / `rgba(0,0,0,0.16)` | `blackAlpha.300` |
| `rgba(0,0,0,0.56)` | `blackAlpha.500` |
| `rgba(0,0,0,0.48)` | `blackAlpha.600` |
| `rgba(0,0,0,0.64)` | `blackAlpha.700` |
| `rgba(0,0,0,0.80)` | `blackAlpha.800` |
| `rgba(0,0,0,0.90)` | `blackAlpha.900` |

For unknown rgba values: note as **unknown token — check with designer**.

---

### Category 3: Hardcoded gradient strings

**Pattern to find**: `linear-gradient(...)` or `background: "linear-gradient..."` in JSX/CSS.

**Token map**:

| Raw gradient | Token |
|---|---|
| `linear-gradient(178deg, #017BFE 1.7%, #00CFFF 98.21%)` | `gr_Packages` |
| `linear-gradient(178deg, #8408FF 1.7%, #93C5FF 98.21%)` | `gr_Hotel` |
| `linear-gradient(178deg, #FF5070 1.7%, #FFC793 98.21%)` | `gr_GroupTours` |

Usage in JSX: `bgGradient="gr_Packages"` or `background="gr_Packages"` (Chakra resolves theme tokens in bg/background props).

---

### Category 4: Hardcoded font sizes

**Pattern to find**: literal pixel or rem font sizes — `fontSize="14px"`, `fontSize="1.5rem"`, `font-size: 12px` — that should use typography variants instead.

**Token map** (use `textStyle` or `as` with heading variants):

| What you see | Preferred approach |
|---|---|
| `fontSize="12px"` / `fontSize="0.75rem"` | `textStyle="text-xs"` |
| `fontSize="14px"` / `fontSize="0.875rem"` | `textStyle="text-sm"` |
| `fontSize="16px"` / `fontSize="1rem"` | `textStyle="text-md"` |
| `fontSize="18px"` / `fontSize="1.125rem"` | `textStyle="text-lg"` |
| `fontSize="20px"` / `fontSize="1.25rem"` | `textStyle="text-xl"` |
| `fontSize="24px"` / `fontSize="1.5rem"` | `textStyle="text-2xl"` |
| large headings | `<Heading textStyle="heading-lg-4xl">` etc. |

**Exception**: pixel sizes on non-text elements (icon sizes, border widths, border radii) are acceptable if no token exists. Note them but do not flag as violations.

---

### Category 5: Hardcoded font-family strings

**Pattern to find**: `fontFamily="..."` or `font-family: '...'` anywhere outside the theme file.

The project font is `"Noto Sans Armenian"` — it is set globally in `src/app/globals.css` and the Chakra theme. There is **never** a valid reason to set `fontFamily` on an individual component. Flag every occurrence.

---

## Step 3 — Report each violation

For every violation, output a block like this:

```
VIOLATION [Category N: Category name]
File:    src/path/to/file.tsx:88
Found:   color="#0B69FF"
Problem: Raw hex color. Should use theme token.
Fix:     color="blue.500"
```

For unknown values where no token exists:
```
UNKNOWN TOKEN
File:    src/path/to/file.tsx:102
Found:   bg="#D4E8FF"
Problem: This hex does not match any token in the theme. 
Action:  Check with designer — if it's a new color, add it to src/shared/ui/foundation/Colors/theme.ts before using it.
```

If a file is clean:
```
✓ src/path/to/file.tsx — no token violations
```

---

## Step 4 — Summary

At the end, output:
- Total files scanned
- Total violations by category
- List of any unknown values that need a designer decision
- Reminder: all new tokens must be added to `src/shared/ui/foundation/Colors/theme.ts` and the `colorsTheme` object — never invented inline
