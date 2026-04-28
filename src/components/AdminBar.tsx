"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminBar() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-sm font-semibold text-[var(--primary)]">Products</Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-[var(--primary)]">View site →</Link>
      </div>
      <button onClick={logout} className="btn-outline text-sm">Sign out</button>
    </div>
  );
}
