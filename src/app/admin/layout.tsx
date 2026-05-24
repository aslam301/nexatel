import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin keeps the dark theme while the public site is light. The theme-dark
  // class re-declares the dark token values for everything beneath this layout.
  return <div className="theme-dark min-h-screen">{children}</div>;
}
