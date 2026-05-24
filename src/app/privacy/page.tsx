import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Nexatel collects, uses and protects your information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="container-wide py-20 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground-strong tracking-tight">Privacy Policy</h1>
      <p className="text-muted mt-5 leading-relaxed">
        This is a placeholder privacy policy for the Nexatel website. We collect only the information
        you submit through our enquiry form (name, email, organisation and message) and use it solely
        to respond to your enquiry. We do not sell or share personal data with third parties.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-foreground-strong">Cookies</h2>
      <p className="text-muted mt-3 leading-relaxed">
        The public website does not set tracking cookies. The administration area uses a single,
        signed, HTTP-only session cookie strictly for access control.
      </p>
      <h2 className="mt-10 text-xl font-semibold text-foreground-strong">Contact</h2>
      <p className="text-muted mt-3 leading-relaxed">
        For privacy questions, email <a className="underline text-cyan-300 hover:text-foreground-strong transition-colors" href="mailto:sales@nexatel.org">sales@nexatel.org</a>.
      </p>
    </article>
  );
}
