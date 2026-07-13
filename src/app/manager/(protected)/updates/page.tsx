import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { deletePost, togglePublish } from "./actions";
import { DeleteButton } from "@/components/manager/delete-button";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Updates" };

export default async function ManagerUpdatesPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Updates</h1>
          <p className="mt-1 text-sm text-muted-foreground">Blog-Beiträge verwalten.</p>
        </div>
        <Link
          href="/manager/updates/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Neuer Beitrag
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Titel</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Erstellt</th>
              <th className="px-4 py-3 text-right font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">
                  <form action={togglePublish.bind(null, post.id, !post.published)}>
                    <button
                      type="submit"
                      className={
                        post.published
                          ? "rounded-full bg-accent/20 px-3 py-1 text-xs text-accent"
                          : "rounded-full bg-surface-hover px-3 py-1 text-xs text-muted-foreground"
                      }
                    >
                      {post.published ? "Veröffentlicht" : "Entwurf"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link href={`/manager/updates/${post.id}`} className="text-accent hover:underline">
                      Bearbeiten
                    </Link>
                    <DeleteButton action={deletePost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  Noch keine Beiträge vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
