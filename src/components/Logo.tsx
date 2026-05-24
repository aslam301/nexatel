import Image from "next/image";

export function Logo({
  variant = "dark",
  size = 32,
  showWordmark = true,
}: {
  variant?: "dark" | "light";
  size?: number;
  showWordmark?: boolean;
}) {
  // Default to the surface-aware foreground token so the wordmark auto-flips
  // between light and dark themes. `variant="light"` forces white for use over
  // imagery / colored backgrounds.
  const wordmark = variant === "light" ? "#ffffff" : "var(--foreground-strong)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }} aria-label="Nexatel logo">
      <Image
        src="/logo.png"
        alt="Nexatel"
        width={size}
        height={size}
        priority
        style={{ width: size, height: size, objectFit: "contain" }}
      />
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
