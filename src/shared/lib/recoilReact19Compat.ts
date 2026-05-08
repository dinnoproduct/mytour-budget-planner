/**
 * Polyfill for Recoil ↔ React 19 compatibility.
 *
 * React 19 removed __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED and
 * replaced it with __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
 * where the dispatcher lives at `H` (set directly, not wrapped in { current }).
 *
 * Recoil reads ReactCurrentDispatcher.current from the old internals object.
 * We re-expose the old shape by making ReactCurrentDispatcher a live proxy
 * whose `.current` getter reads from `H`.
 */
import React from 'react'

type AnyReact = typeof React & Record<string, unknown>

export function patchRecoilReact19() {
  const r = React as AnyReact
  if (r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) return

  const ci = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE as
    | Record<string, unknown>
    | undefined
  if (!ci) return

  // React 19 sets H = dispatcher directly; Recoil reads ReactCurrentDispatcher.current
  // so we wrap H in a { current } ref-like accessor.
  const ReactCurrentDispatcher = {
    get current() {
      return ci['H']
    },
  }

  const ReactCurrentOwner = {
    current: null,
    get currentDispatcher() {
      return ci['H']
    },
  }

  Object.defineProperty(r, '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', {
    configurable: true,
    enumerable: false,
    get(): Record<string, unknown> {
      return {
        ...ci,
        ReactCurrentDispatcher,
        ReactCurrentBatchConfig: ci['T'],
        ReactCurrentCache: ci['A'],
        ReactCurrentOwner,
      }
    },
  })
}
