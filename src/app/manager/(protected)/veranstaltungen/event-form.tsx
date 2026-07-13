import { ImageUploadField } from "@/components/manager/image-upload-field";
import { VideoUploadField } from "@/components/manager/video-upload-field";
import { RichTextEditor } from "@/components/manager/rich-text-editor";
import type { Event } from "@prisma/client";
import { toDateTimeLocal } from "@/lib/format";

export function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => void;
  event?: Event;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="title" className="text-sm text-muted-foreground">
          Titel
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event?.title}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-muted-foreground">Beschreibung</label>
        <div className="mt-1">
          <RichTextEditor name="description" defaultValue={event?.description} />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="text-sm text-muted-foreground">
          Ort
        </label>
        <input
          id="location"
          name="location"
          defaultValue={event?.location ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="text-sm text-muted-foreground">
            Beginn
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={toDateTimeLocal(event?.startDate)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm text-muted-foreground">
            Ende (optional)
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={toDateTimeLocal(event?.endDate)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="capacity" className="text-sm text-muted-foreground">
          Kapazität (optional, für Hype-Bar)
        </label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          defaultValue={event?.capacity ?? ""}
          placeholder="z. B. 50"
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <ImageUploadField name="coverImage" label="Titelbild" defaultValue={event?.coverImage} />
      <VideoUploadField name="promoVideo" label="Werbevideo" defaultValue={event?.promoVideo} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={event?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        Veröffentlicht
      </label>

      <button
        type="submit"
        className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {event ? "Speichern" : "Veranstaltung erstellen"}
      </button>
    </form>
  );
}
