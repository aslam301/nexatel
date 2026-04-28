export function Logo({ variant = "dark", size = 28 }: { variant?: "dark" | "light"; size?: number }) {
  const fg = variant === "light" ? "#ffffff" : "#0a2540";
  const accent = "#f59e0b";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="7" fill={fg} />
        <path d="M9 22V10h2.4l6.2 7.8V10H20v12h-2.4l-6.2-7.8V22H9z" fill={accent} />
      </svg>
      <span style={{ color: fg, fontWeight: 700, fontSize: size * 0.7, letterSpacing: "-0.02em" }}>
        Nexatel
      </span>
    </span>
  );
}
