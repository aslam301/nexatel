import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // AdminShell renders its own sidebar + topbar, so the layout is just a passthrough.
  // Login page has its own minimal layout; everything else is wrapped by AdminShell.
  return <>{children}</>;
}
