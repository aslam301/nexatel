import type { CapabilityStep } from "@/lib/types";

export function ProcessTimeline({ steps }: { steps: CapabilityStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <li key={idx} className="relative grid grid-cols-[auto_1fr] gap-6 pb-10 last:pb-0">
            {/* Connector line + numbered marker */}
            <div className="relative flex flex-col items-center">
              <div
                className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full font-mono text-xs font-semibold tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.20))",
                  color: "#fff",
                  border: "1px solid rgba(124, 58, 237, 0.45)",
                  boxShadow:
                    "0 0 0 4px rgba(124, 58, 237, 0.10), 0 8px 24px -8px rgba(124, 58, 237, 0.5)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
              {!isLast && (
                <div
                  className="absolute top-11 bottom-0 w-px"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(124,58,237,0.45), rgba(6,182,212,0.10) 70%, transparent)",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1.5">
              <h3 className="text-base md:text-lg font-semibold text-white tracking-tight">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm md:text-[15px] text-slate-400 leading-relaxed max-w-prose">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
