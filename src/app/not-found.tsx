import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-wide py-32 text-center">
      <div className="text-sm uppercase tracking-widest text-[var(--accent-strong)] font-semibold">404</div>
      <h1 className="mt-3 text-4xl font-bold text-[var(--primary)]">Page not found</h1>
      <p className="mt-3 text-slate-600 max-w-md mx-auto">
        The page you&rsquo;re looking for has been moved or never existed.
      </p>
      <Link href="/" className="btn-primary mt-8">Go home</Link>
    </section>
  );
}
