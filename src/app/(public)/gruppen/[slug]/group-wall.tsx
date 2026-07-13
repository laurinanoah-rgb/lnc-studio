"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/format";
import { createGroupPost, replyToGroupPost } from "./actions";

type ReplyData = {
  id: string;
  content: string;
  createdAt: Date;
  author: { name: string };
};

type PostData = {
  id: string;
  content: string;
  createdAt: Date;
  author: { name: string };
  replies: ReplyData[];
};

export function GroupWall({
  groupId,
  slug,
  posts,
}: {
  groupId: string;
  slug: string;
  posts: PostData[];
}) {
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const postAction = createGroupPost.bind(null, groupId, slug);

  return (
    <div>
      <form action={postAction} className="flex flex-col gap-3">
        <textarea
          name="content"
          required
          rows={3}
          placeholder="Was gibt's Neues?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          Posten
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        {posts.map((post) => {
          const replyAction = replyToGroupPost.bind(null, post.id, groupId, slug);
          const replyOpen = openReplyId === post.id;

          return (
            <div key={post.id} className="rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(post.createdAt)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{post.content}</p>

              {post.replies.length > 0 && (
                <div className="mt-3 flex flex-col gap-3 border-l border-border pl-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id}>
                      <p className="text-xs font-medium">{reply.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(reply.createdAt)}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpenReplyId(replyOpen ? null : post.id)}
                className="mt-3 text-xs text-accent hover:underline"
              >
                {replyOpen ? "Abbrechen" : "Antworten"}
              </button>

              {replyOpen && (
                <form
                  action={async (formData) => {
                    await replyAction(formData);
                    setOpenReplyId(null);
                  }}
                  className="mt-2 flex flex-col gap-2"
                >
                  <textarea
                    name="content"
                    required
                    rows={2}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="self-start rounded-full border border-border px-4 py-1.5 text-xs transition-colors hover:bg-surface-hover"
                  >
                    Antwort senden
                  </button>
                </form>
              )}
            </div>
          );
        })}
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground">Noch keine Beiträge. Schreib den ersten!</p>
        )}
      </div>
    </div>
  );
}
