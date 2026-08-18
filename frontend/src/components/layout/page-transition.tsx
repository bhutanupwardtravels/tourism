/**
 * Page content is NOT animated on route change.
 *
 * This wrapper used to be a `motion.div` with `initial={{ opacity: 0 }}`.
 * Framer Motion serialises `initial` into an inline style, so every
 * server-rendered page shipped with the entire document at `opacity: 0` and
 * stayed invisible until hydration finished — a blank screen for anyone on a
 * slow device or connection, and permanently blank with JS disabled. The
 * 250ms of polish was not worth gating the whole site behind JavaScript.
 *
 * If a route transition is wanted again, animate an overlay on top of the
 * content, never the content itself.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
