import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-wide py-32 text-center">
      <div className="eyebrow">404</div>
      <h1
        className="mt-4 text-5xl md:text-6xl font-semibold tracking-tight"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #a5f3fc 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Page not found
      </h1>
      <p className="mt-4 text-muted max-w-md mx-auto leading-relaxed">
        The page you&rsquo;re looking for has been moved or never existed.
      </p>
      <Link href="/" className="btn-primary mt-10">Go home</Link>
    </section>
  );
}
