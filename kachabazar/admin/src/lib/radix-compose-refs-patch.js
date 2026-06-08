/**
 * Patched version of @radix-ui/react-compose-refs for React 19 compatibility.
 *
 * ROOT CAUSE: React 19 treats callback refs that return a cleanup function as
 * "new" refs when their identity changes. The original `composeRefs` returns a
 * new function every call, and when sub-refs are state setters like
 * `(node) => setContent(node)`, the detach/attach cycle triggers setState
 * twice per render → infinite loop (Maximum update depth exceeded).
 *
 * CRITICAL: There are 18+ nested copies of @radix-ui/react-slot inside
 * other Radix packages (react-checkbox, react-dialog, react-select, etc.)
 * that all call `composeRefs(forwardedRef, childrenRef)` during render.
 * Vite aliases redirect their `@radix-ui/react-compose-refs` import here,
 * so this patch applies to ALL of them.
 *
 * FIX:
 * - `setRef`: Never returns cleanup (prevents React 19 ref cycling).
 * - `composeRefs`: Uses WeakMap cache keyed on any non-null ref argument.
 *   When ALL refs are null/undefined, returns a singleton no-op.
 *   The cached function reads from a mutable store so it always applies
 *   the latest refs even though its identity is stable.
 * - `useComposedRefs`: Stable via useRef + useCallback([], []).
 */
import { useRef, useCallback } from "react";

function setRef(ref, value) {
  if (typeof ref === "function") {
    // Call the ref but NEVER return the cleanup.
    // React 19 interprets a returned function as cleanup, and if
    // the ref identity changes next render it calls cleanup then
    // calls the new ref — triggering setState loops.
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

// Cache: WeakMap keyed on any non-null/non-undefined ref object/function.
// The value is { composedFn, refsStore } where composedFn is stable and
// refsStore.current is updated every call so the function applies latest refs.
const composeRefsCache = new WeakMap();

// Singleton no-op for when all refs are null/undefined
const NOOP_REF = () => {};

function composeRefs(...refs) {
  // Find the first ref that can serve as a WeakMap key (object or function).
  // We search all args, not just the first, because forwardedRef is often null.
  let cacheKey = null;
  for (let i = 0; i < refs.length; i++) {
    const r = refs[i];
    if (
      r !== null &&
      r !== undefined &&
      (typeof r === "object" || typeof r === "function")
    ) {
      cacheKey = r;
      break;
    }
  }

  // If ALL refs are null/undefined/primitives, nothing to compose — return no-op
  if (cacheKey === null) {
    return NOOP_REF;
  }

  let cached = composeRefsCache.get(cacheKey);
  if (!cached) {
    // Create a mutable store and a stable composed function
    const refsStore = { current: refs };
    const composedFn = (node) => {
      const currentRefs = refsStore.current;
      for (let i = 0; i < currentRefs.length; i++) {
        const ref = currentRefs[i];
        if (ref) setRef(ref, node);
      }
    };
    cached = { composedFn, refsStore };
    composeRefsCache.set(cacheKey, cached);
  }

  // Always update the stored refs to the latest values
  cached.refsStore.current = refs;
  return cached.composedFn;
}

function useComposedRefs(...refs) {
  const refsRef = useRef(refs);
  refsRef.current = refs;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((node) => {
    const currentRefs = refsRef.current;
    for (let i = 0; i < currentRefs.length; i++) {
      const ref = currentRefs[i];
      if (ref) setRef(ref, node);
    }
  }, []); // stable — never changes identity
}

export { composeRefs, useComposedRefs };
