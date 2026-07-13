import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "../post-form";
import { createPost } from "../actions";

export const metadata: Metadata = { title: "Neuer Beitrag" };

export default function NewPostPage() {
  return (
    <div className="max-w-2xl">
      <Link href="/manager/updates" className="text-sm text-muted-foreground hover:text-foreground">
        ← Zurück zu Updates
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Neuer Beitrag</h1>
      <div className="mt-6">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
