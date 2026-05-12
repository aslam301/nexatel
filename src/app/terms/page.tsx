import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms of use for the Nexatel website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <article className="container-wide py-20 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">Terms of Use</h1>
      <p className="text-slate-400 mt-5 leading-relaxed">
        This website is provided for informational purposes. Specifications, prices and availability
        are indicative and may be revised without notice. Formal commercial offers are governed by
        the terms of an executed contract or quotation.
      </p>
    </article>
  );
}
