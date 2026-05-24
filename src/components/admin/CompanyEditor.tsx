"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Company, Office, ValuePillar, FocusArea } from "@/lib/types";

const ICON_OPTIONS = ["building", "fiber", "bolt", "tower", "cabling", "cpu", "box", "cctv"];

export function CompanyEditor({ initial }: { initial: Company }) {
  const router = useRouter();
  const [c, setC] = useState<Company>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function save() {
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !body.ok) throw new Error(body.error || "Save failed");
      setOk(true);
      router.refresh();
      setTimeout(() => setOk(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <Card title="Identity" defaultOpen>
        <div className="grid sm:grid-cols-2 gap-3">
          <Row label="Brand name *"><Input value={c.name} onChange={(v) => setC({ ...c, name: v })} /></Row>
          <Row label="Legal name *"><Input value={c.legalName} onChange={(v) => setC({ ...c, legalName: v })} /></Row>
          <Row label="Tagline"><Input value={c.tagline} onChange={(v) => setC({ ...c, tagline: v })} /></Row>
          <Row label="Founded year"><Input value={c.founded} onChange={(v) => setC({ ...c, founded: v })} /></Row>
        </div>
        <Row label="Short description"><Textarea rows={2} value={c.shortDescription} onChange={(v) => setC({ ...c, shortDescription: v })} /></Row>
        <Row label="Long description"><Textarea rows={4} value={c.description} onChange={(v) => setC({ ...c, description: v })} /></Row>
        <Row label="Support email"><Input value={c.supportEmail} onChange={(v) => setC({ ...c, supportEmail: v })} /></Row>
        <Row label="Support phone"><Input value={c.supportPhone} onChange={(v) => setC({ ...c, supportPhone: v })} /></Row>
      </Card>

      <Card title="Mission, Vision, Values">
        <Row label="Mission"><Textarea rows={3} value={c.mission} onChange={(v) => setC({ ...c, mission: v })} /></Row>
        <Row label="Vision"><Textarea rows={3} value={c.vision} onChange={(v) => setC({ ...c, vision: v })} /></Row>
        <div>
          <label className="label">Values</label>
          <ValuesEditor values={c.values} onChange={(values) => setC({ ...c, values })} />
        </div>
      </Card>

      <Card title="Areas of Focus">
        <FocusEditor areas={c.areasOfFocus} onChange={(areasOfFocus) => setC({ ...c, areasOfFocus })} />
      </Card>

      <Card title="Verticals (footer column)">
        <ListEditor items={c.verticals} onChange={(verticals) => setC({ ...c, verticals })} placeholder="e.g. Structured Cabling" />
      </Card>

      <Card title="Offices">
        <OfficesEditor offices={c.offices} onChange={(offices) => setC({ ...c, offices })} />
      </Card>

      <Card title="Sister company">
        <div className="grid sm:grid-cols-2 gap-3">
          <Row label="Name"><Input value={c.partner?.name ?? ""} onChange={(v) => setC({ ...c, partner: { ...(c.partner ?? { name: "", url: "", country: "" }), name: v } })} /></Row>
          <Row label="Country"><Input value={c.partner?.country ?? ""} onChange={(v) => setC({ ...c, partner: { ...(c.partner ?? { name: "", url: "", country: "" }), country: v } })} /></Row>
          <Row label="URL"><Input value={c.partner?.url ?? ""} onChange={(v) => setC({ ...c, partner: { ...(c.partner ?? { name: "", url: "", country: "" }), url: v } })} /></Row>
          <Row label="Legal name (optional)"><Input value={c.partner?.legalName ?? ""} onChange={(v) => setC({ ...c, partner: { ...(c.partner ?? { name: "", url: "", country: "" }), legalName: v } })} /></Row>
        </div>
        <Row label="Note"><Textarea rows={2} value={c.partner?.note ?? ""} onChange={(v) => setC({ ...c, partner: { ...(c.partner ?? { name: "", url: "", country: "" }), note: v } })} /></Row>
      </Card>

      <Card title="Social links">
        <div className="grid sm:grid-cols-2 gap-3">
          <Row label="LinkedIn"><Input value={c.social.linkedin} onChange={(v) => setC({ ...c, social: { ...c.social, linkedin: v } })} /></Row>
          <Row label="Twitter / X"><Input value={c.social.twitter} onChange={(v) => setC({ ...c, social: { ...c.social, twitter: v } })} /></Row>
          <Row label="Facebook"><Input value={c.social.facebook} onChange={(v) => setC({ ...c, social: { ...c.social, facebook: v } })} /></Row>
          <Row label="Instagram"><Input value={c.social.instagram} onChange={(v) => setC({ ...c, social: { ...c.social, instagram: v } })} /></Row>
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-5 md:-mx-8 px-5 md:px-8 py-4 border-t border-[var(--border)] backdrop-blur-md" style={{ background: "rgba(10,15,31,0.85)" }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            {error && <span className="text-sm text-red-300">{error}</span>}
            {ok && <span className="text-sm text-emerald-300">Saved.</span>}
          </div>
          <button onClick={save} disabled={busy} className="btn-primary">{busy ? "Saving…" : "Save company"}</button>
        </div>
      </div>
    </div>
  );

  function ValuesEditor({ values, onChange }: { values: ValuePillar[]; onChange: (v: ValuePillar[]) => void }) {
    return (
      <div className="space-y-3 mt-2">
        {values.map((v, i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <Input value={v.title} onChange={(x) => onChange(values.map((y, j) => (j === i ? { ...y, title: x } : y)))} placeholder="Title" />
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-xs text-red-300 hover:text-red-200 px-2">Remove</button>
            </div>
            <Textarea rows={2} value={v.description} onChange={(x) => onChange(values.map((y, j) => (j === i ? { ...y, description: x } : y)))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, { title: "New value", description: "" }])} className="btn-outline">+ Add value</button>
      </div>
    );
  }

  function FocusEditor({ areas, onChange }: { areas: FocusArea[]; onChange: (a: FocusArea[]) => void }) {
    return (
      <div className="space-y-3">
        {areas.map((a, i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] p-3 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2">
              <Input value={a.title} onChange={(x) => onChange(areas.map((y, j) => (j === i ? { ...y, title: x } : y)))} placeholder="Title" />
              <select
                className="select"
                style={{ maxWidth: 160 }}
                value={a.icon ?? "building"}
                onChange={(e) => onChange(areas.map((y, j) => (j === i ? { ...y, icon: e.target.value } : y)))}
              >
                {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <button type="button" onClick={() => onChange(areas.filter((_, j) => j !== i))} className="text-xs text-red-300 hover:text-red-200 px-2">Remove</button>
            </div>
            <Textarea rows={2} value={a.description} onChange={(x) => onChange(areas.map((y, j) => (j === i ? { ...y, description: x } : y)))} />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...areas, { title: "New area", description: "", icon: "building" }])} className="btn-outline">+ Add area</button>
      </div>
    );
  }

  function OfficesEditor({ offices, onChange }: { offices: Office[]; onChange: (o: Office[]) => void }) {
    return (
      <div className="space-y-3">
        {offices.map((o, i) => (
          <div key={i} className="rounded-lg border border-[var(--border)] p-4 space-y-3" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Row label="City *"><Input value={o.city} onChange={(v) => onChange(offices.map((x, j) => (j === i ? { ...x, city: v } : x)))} /></Row>
              <Row label="Country"><Input value={o.country} onChange={(v) => onChange(offices.map((x, j) => (j === i ? { ...x, country: v } : x)))} /></Row>
            </div>
            <Row label="Address"><Textarea rows={2} value={o.address} onChange={(v) => onChange(offices.map((x, j) => (j === i ? { ...x, address: v } : x)))} /></Row>
            <div className="grid sm:grid-cols-2 gap-3">
              <Row label="Phone"><Input value={o.phone} onChange={(v) => onChange(offices.map((x, j) => (j === i ? { ...x, phone: v } : x)))} /></Row>
              <Row label="Email"><Input value={o.email} onChange={(v) => onChange(offices.map((x, j) => (j === i ? { ...x, email: v } : x)))} /></Row>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={o.isHeadquarters} onChange={(e) => onChange(offices.map((x, j) => (j === i ? { ...x, isHeadquarters: e.target.checked } : x)))} />
                Headquarters
              </label>
              <button type="button" onClick={() => onChange(offices.filter((_, j) => j !== i))} className="text-xs text-red-300 hover:text-red-200">Remove office</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...offices, { city: "", country: "", address: "", phone: "", email: "", isHeadquarters: false }])} className="btn-outline">+ Add office</button>
      </div>
    );
  }
}

function Card({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <h2 className="text-base md:text-lg font-semibold text-white">{title}</h2>
        <span className="text-slate-400 text-2xl leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 pb-6 space-y-4 border-t border-[var(--border)] pt-5">{children}</div>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className="textarea" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function ListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (i: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={it} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} placeholder={placeholder} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-xs text-red-300 hover:text-red-200 px-2">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className="btn-outline">+ Add</button>
    </div>
  );
}
