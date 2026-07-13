import { ImageUploadField } from "@/components/manager/image-upload-field";
import type { Post } from "@prisma/client";

export function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => void;
  post?: Post;
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
          defaultValue={post?.title}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="text-sm text-muted-foreground">
          Kurzbeschreibung
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="text-sm text-muted-foreground">
          Inhalt
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          defaultValue={post?.content}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <ImageUploadField name="coverImage" label="Titelbild" defaultValue={post?.coverImage} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="h-4 w-4 rounded border-border"
        />
        Veröffentlicht
      </label>

      <button
        type="submit"
        className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
      >
        {post ? "Speichern" : "Beitrag erstellen"}
      </button>
    </form>
  );
}
