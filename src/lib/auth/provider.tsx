import type { ReactNode } from "react";

/** Stable mount point in `__root.tsx`. No auth on this static site. */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
