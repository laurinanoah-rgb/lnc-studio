import { ImageUploadField } from "@/components/manager/image-upload-field";
import { RichTextEditor } from "@/components/manager/rich-text-editor";
import { toDateTimeLocal } from "@/lib/format";

export type ExistingGroupEvent = {
  title: string;
  description: string;
  location: string | null;
  startDate: Date;
  capacity: number | null;
  coverImage: string | null;
};

export function GroupEventForm({
  action,
  defaultPublic,
  existingEvent,
}: {
  action: (formData: FormData) => void;
  defaultPublic: boolean;
  existingEvent?: ExistingGroupEvent | null;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="event-title" className="text-sm text-muted-foreground">
          Titel
        </label>
        <input
          id="event-title"
          name="title"
          required
          placeholder="z. B. Halloween Karneval bei uns"
          defaultValue={existingEvent?.title}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-muted-foreground">Beschreibung</label>
        <div className="mt-1">
          <RichTextEditor name="description" defaultValue={existingEvent?.description} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="event-location" className="text-sm text-muted-foreground">
            Ort
          </label>
          <input
            id="event-location"
            name="location"
            placeholder="Straße, Ort…"
            defaultValue={existingEvent?.location ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="event-start" className="text-sm text-muted-foreground">
            Beginn
          </label>
          <input
            id="event-start"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={existingEvent ? toDateTimeLocal(existingEvent.startDate) : undefined}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="event-capacity" className="text-sm text-muted-foreground">
            Kapazität
          </label>
          <input
            id="event-capacity"
            name="capacity"
            type="number"
            min={1}
            placeholder="optional"
            defaultValue={existingEvent?.capacity ?? undefined}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <ImageUploadField
            name="coverImage"
            label="Titelbild"
            defaultValue={existingEvent?.coverImage}
          />
        </div>
      </div>

      <label className="flex items-start gap-2 rounded-lg border border-border bg-background/50 px-3 py-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="public"
          defaultChecked={defaultPublic}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        <span>
          🌐 Gruppe öffentlich machen — die Veranstaltung erscheint dann auch für alle auf{" "}
          <span className="text-foreground">/veranstaltungen</span>, nicht nur für
          Gruppenmitglieder.
        </span>
      </label>

      <button
        type="submit"
        className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {existingEvent ? "Veranstaltung aktualisieren" : "Veranstaltung erstellen"}
      </button>
    </form>
  );
}
