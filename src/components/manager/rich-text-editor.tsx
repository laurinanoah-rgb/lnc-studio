"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/upload-client";

function ToolbarButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [html, setHtml] = useState(defaultValue ?? "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        link: false,
      }),
      ImageExtension,
    ],
    content: defaultValue ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }: { editor: Editor }) => {
      setHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rich-content min-h-[200px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent",
      },
    },
  });

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // Bild-Upload fehlgeschlagen; Nutzer kann es erneut versuchen.
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (!editor) {
    return (
      <div className="min-h-[200px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
        Editor wird geladen…
      </div>
    );
  }

  return (
    <div>
      <input type="hidden" name={name} value={html} />
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Fett
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Kursiv
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Trennlinie
        </ToolbarButton>
        <ToolbarButton disabled={uploading} onClick={() => fileInputRef.current?.click()}>
          {uploading ? "Wird hochgeladen…" : "Bild einfügen"}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
