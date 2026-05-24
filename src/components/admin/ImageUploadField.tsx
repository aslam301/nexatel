"use client";

import { useRef, useState } from "react";

interface Props {
  /** Form field name; the hidden input receives the resolved URL. */
  name: string;
  /** Existing image URL (edit mode). */
  defaultValue?: string;
  /** Scope segment in the R2 key, e.g. "services", "products", "projects". */
  scope: "services" | "products" | "projects" | "misc";
  /** Slug or short name used inside the object key (collision-resistant suffix is appended). */
  slugHint?: string;
  label?: string;
  helperText?: string;
  /** Error message from validation (renders below the field). */
  error?: string;
  /** Optional controlled-mode callback. When set, parent receives every value change. */
  onChangeValue?: (value: string) => void;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml";
const MAX_MB = 10;

export function ImageUploadField({
  name,
  defaultValue,
  scope,
  slugHint,
  label = "Image",
  helperText,
  error,
  onChangeValue,
}: Props) {
  const [value, setValueState] = useState<string>(defaultValue ?? "");
  const setValue = (v: string) => {
    setValueState(v);
    onChangeValue?.(v);
  };
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setUploadError(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`File too large. Max ${MAX_MB} MB.`);
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      // 1) Ask server for a presigned PUT URL.
      const presignRes = await fetch("/api/admin/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          scope,
          slugHint,
        }),
      });
      const presign = (await presignRes.json()) as {
        ok: boolean;
        uploadUrl?: string;
        publicUrl?: string;
        error?: string;
      };
      if (!presignRes.ok || !presign.ok || !presign.uploadUrl || !presign.publicUrl) {
        throw new Error(presign.error || "Could not get upload URL");
      }

      // 2) PUT the file straight to R2 with progress reporting.
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.uploadUrl!);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed (${xhr.status})`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      setValue(presign.publicUrl);
      setProgress(100);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function onPaste(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function onClear() {
    setValue("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const hasPreview = value && /^https?:\/\//.test(value);

  return (
    <div>
      <label className="label">{label}</label>

      {hasPreview && (
        <div className="mb-3 rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)]">
          {/* Using a plain <img> here so admin previews are not constrained
              by next/image's remote-pattern allowlist before save. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="max-h-56 w-full object-contain bg-black/20"
            onError={() => setUploadError("Could not load image preview")}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
          className="hidden"
          id={`${name}-file`}
        />
        <label
          htmlFor={`${name}-file`}
          className={`btn-outline cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}
        >
          {busy ? "Uploading…" : hasPreview ? "Replace image" : "Upload image"}
        </label>
        {hasPreview && (
          <button type="button" onClick={onClear} className="text-sm text-slate-400 hover:text-red-300 transition-colors">
            Remove
          </button>
        )}
        {busy && progress > 0 && (
          <span className="text-xs font-mono text-slate-400">{progress}%</span>
        )}
      </div>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onPaste}
        placeholder="…or paste an https:// URL"
        className="input mt-3"
      />

      {busy && progress > 0 && progress < 100 && (
        <div className="mt-2 h-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div
            className="h-full"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--violet), var(--tech))" }}
          />
        </div>
      )}

      {uploadError && <p className="field-error mt-2">{uploadError}</p>}
      {error && <p className="field-error">{error}</p>}
      {helperText && !uploadError && !error && (
        <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
      )}
    </div>
  );
}
