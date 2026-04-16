"use client";

/**
 * Compatibility shim: react-router-dom → next/navigation
 *
 * Drop-in replacements for the most common react-router-dom hooks and
 * components so existing code works in Next.js with minimal changes.
 */

export {
  useRouter,
  usePathname,
  useParams,
} from "next/navigation";

// Re-export useSearchParams with the same interface as react-router-dom v6
// react-router: const [params, setParams] = useSearchParams()
// next:         const params = useSearchParams()  (read-only)
export { useSearchParams } from "./_useSearchParams";

// re-export useNavigate compat
export { useNavigate } from "./_useNavigate";

// re-export useLocation compat
export { useLocation } from "./_useLocation";
