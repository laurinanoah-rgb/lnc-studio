import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";
import { updatePost } from "../actions";

export const metadata: Metadata = { title: "Beitrag bearbeiten" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updatePost.bind(null, post.id);

  return (
    <div className="max-w-2xl">
      <Link href="/manager/updates" className="text-sm text-muted-foreground hover:text-foreground">
        ← Zurück zu Updates
      </Link>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Beitrag bearbeiten</h1>
      <div className="mt-6">
        <PostForm action={action} post={post} />
      </div>
    </div>
  );
}
