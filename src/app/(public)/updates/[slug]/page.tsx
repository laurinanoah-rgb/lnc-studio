import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  return { title: post?.title ?? "Update" };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: true } });

  if (!post || !post.published) notFound();

  return (
    <Container className="max-w-3xl py-16">
      <p className="text-sm text-muted-foreground">
        {formatDate(post.createdAt)} · {post.author.name}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="mt-8 w-full rounded-2xl border border-border object-cover"
        />
      )}
      <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
        {post.content}
      </div>
    </Container>
  );
}
