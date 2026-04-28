import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Nexatel collects, uses and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="container-wide py-16 max-w-3xl prose prose-slate">
      <h1 className="text-3xl font-bold text-[var(--primary)]">Privacy Policy</h1>
      <p className="text-slate-600 mt-3">
        This is a placeholder privacy policy for the Nexatel website. We collect only the information
        you submit through our enquiry form (name, email, organisation and message) and use it solely
        to respond to your enquiry. We do not sell or share personal data with third parties.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-[var(--primary)]">Cookies</h2>
      <p className="text-slate-600 mt-2">
        The public website does not set tracking cookies. The administration area uses a single,
        signed, HTTP-only session cookie strictly for access control.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-[var(--primary)]">Contact</h2>
      <p className="text-slate-600 mt-2">
        For privacy questions, email <a className="underline" href="mailto:hello@nexatel.example">hello@nexatel.example</a>.
      </p>
    </article>
  );
}
