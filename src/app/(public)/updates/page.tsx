import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Updates" };

export default async function UpdatesPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Updates</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">Neuigkeiten aus der Community.</p>

      {posts.length === 0 ? (
        <p className="mt-12 text-muted-foreground">Noch keine Beiträge veröffentlicht.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/updates/${post.slug}`}>
              <Card className="flex h-full flex-col transition-colors hover:bg-surface-hover">
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    className="-mx-6 -mt-6 mb-4 aspect-video rounded-t-2xl object-cover"
                  />
                )}
                <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
