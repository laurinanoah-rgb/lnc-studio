"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/upload-client";

export function ImageUploadField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const { url } = await uploadFile(file);
      setUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1 flex items-center gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-16 w-16 rounded-lg border border-border object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-surface-hover file:px-4 file:py-2 file:text-sm file:text-foreground"
        />
      </div>
      {uploading && <p className="mt-1 text-xs text-muted-foreground">Wird hochgeladen…</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
