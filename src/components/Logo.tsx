export function Logo({
  variant = "dark",
  size = 32,
  showWordmark = true,
}: {
  variant?: "dark" | "light";
  size?: number;
  showWordmark?: boolean;
}) {
  // Wordmark colour: white-ish on dark surfaces, deep navy on light surfaces.
  const wordmark = variant === "light" ? "#ffffff" : "#F1F5F9";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }} aria-label="Nexatel logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Stylised "N" — bold rounded strokes in brand blue */}
        <g
          fill="none"
          stroke="#3B82F6"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left vertical */}
          <path d="M16 14 L16 54" />
          {/* Diagonal */}
          <path d="M16 14 L48 54" />
          {/* Right vertical */}
          <path d="M48 14 L48 54" />
        </g>
        {/* Wifi/signal arcs in brand orange */}
        <g fill="none" stroke="#F59E0B" strokeWidth={3.5} strokeLinecap="round">
          <path d="M52 14 A6 6 0 0 1 58 20" />
          <path d="M48 10 A12 12 0 0 1 60 22" />
          <path d="M44 6 A18 18 0 0 1 62 24" />
        </g>
      </svg>
      {showWordmark && (
        <span
          style={{
            color: wordmark,
            fontWeight: 700,
            fontSize: size * 0.62,
            letterSpacing: "-0.02em",
          }}
        >
          Nexatel
        </span>
      )}
    </span>
  );
}
