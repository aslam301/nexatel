import type { CapabilityStep } from "@/lib/types";

export function ProcessTimeline({ steps }: { steps: CapabilityStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <li key={idx} className="relative grid grid-cols-[auto_1fr] gap-5 pb-10 last:pb-0">
            {/* Connector line + numbered marker */}
            <div className="relative flex flex-col items-center">
              <div
                className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-semibold tracking-wider"
                style={{
                  background: "linear-gradient(135deg, var(--primary), #0c2c4f)",
                  color: "#fff",
                  boxShadow: "0 0 0 4px rgba(6,182,212,0.10)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>
              {!isLast && (
                <div
                  className="absolute top-10 bottom-0 w-px"
                  aria-hidden
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,37,64,0.25), rgba(10,37,64,0.05) 70%, transparent)",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div className="pt-1.5">
              <h3 className="text-base md:text-lg font-semibold text-[var(--primary)] tracking-tight">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm md:text-[15px] text-slate-600 leading-relaxed max-w-prose">
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
