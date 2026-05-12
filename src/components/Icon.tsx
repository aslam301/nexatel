type IconName =
  | "cpu"
  | "fiber"
  | "tower"
  | "bolt"
  | "box"
  | "check"
  | "arrow"
  | "phone"
  | "mail"
  | "pin"
  | "shield"
  | "globe"
  | "drill"
  | "trench"
  | "manhole"
  | "gauge"
  | "wind"
  | "splice"
  | "cctv"
  | "cabling"
  | "sparkle"
  | "partner"
  | "search";

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "cpu":
      return (
        <svg {...props}><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/><rect x="9" y="9" width="6" height="6"/></svg>
      );
    case "fiber":
      return (
        <svg {...props}><path d="M2 12h6M16 12h6"/><circle cx="12" cy="12" r="4"/><path d="M8 12c0-3 2-5 4-5s4 2 4 5-2 5-4 5-4-2-4-5z"/></svg>
      );
    case "tower":
      return (
        <svg {...props}><path d="M12 8v14M8 22l4-4 4 4M5 4c2 2 2 6 0 8M19 4c-2 2-2 6 0 8M8 6c1 1 1 3 0 4M16 6c-1 1-1 3 0 4"/></svg>
      );
    case "bolt":
      return (
        <svg {...props}><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>
      );
    case "box":
      return (
        <svg {...props}><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
      );
    case "check":
      return (
        <svg {...props}><path d="M5 12l5 5 9-11"/></svg>
      );
    case "arrow":
      return (
        <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      );
    case "phone":
      return (
        <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      );
    case "mail":
      return (
        <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
      );
    case "pin":
      return (
        <svg {...props}><path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
      );
    case "shield":
      return (
        <svg {...props}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></svg>
      );
    case "globe":
      return (
        <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3 4.5 6.5 4.5 10S15 19 12 22M12 2c-3 3-4.5 6.5-4.5 10S9 19 12 22"/></svg>
      );
    case "drill":
      return (
        <svg {...props}><path d="M3 10h8v4H3z"/><path d="M11 11l4-2v6l-4-2"/><path d="M15 9l4-1v8l-4-1"/><path d="M19 8l2 4-2 4"/><path d="M5 14v4M9 14v3"/></svg>
      );
    case "trench":
      return (
        <svg {...props}><path d="M3 7v10M21 7v10"/><path d="M3 17h18"/><path d="M3 7h6M15 7h6"/><path d="M9 7v3M15 7v3"/><path d="M9 13h6"/></svg>
      );
    case "manhole":
      return (
        <svg {...props}><circle cx="12" cy="9" r="6"/><circle cx="12" cy="9" r="3"/><path d="M6 21l4-7M18 21l-4-7"/></svg>
      );
    case "gauge":
      return (
        <svg {...props}><path d="M12 14a8 8 0 1 1 8-8"/><path d="M12 14l4-5"/><circle cx="12" cy="14" r="1.2" fill="currentColor"/><path d="M4 17h16"/></svg>
      );
    case "wind":
      return (
        <svg {...props}><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h17a3 3 0 1 1-3 3"/><path d="M3 16h9"/></svg>
      );
    case "splice":
      return (
        <svg {...props}><path d="M2 12h6"/><path d="M16 12h6"/><rect x="8" y="9" width="8" height="6" rx="1"/><path d="M10 9v-2M14 9v-2M10 17v-2M14 17v-2"/></svg>
      );
    case "cctv":
      return (
        <svg {...props}><rect x="3" y="6" width="14" height="6" rx="1"/><path d="M17 8l4-2v6l-4-2"/><path d="M7 12v3a3 3 0 0 0 3 3h2"/><circle cx="14" cy="18" r="2"/></svg>
      );
    case "cabling":
      return (
        <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="6" cy="6" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18" cy="18" r="1.2" fill="currentColor"/></svg>
      );
    case "sparkle":
      return (
        <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>
      );
    case "partner":
      return (
        <svg {...props}><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20c0-3 2.5-5 6-5s6 2 6 5"/><path d="M10 20c0-3 2.5-5 6-5s6 2 6 5"/></svg>
      );
    case "search":
      return (
        <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      );
    default:
      return null;
  }
}
