"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/lib/format";
import { postEventComment, deleteEventComment } from "./actions";
import { UserBadge } from "@/components/user-badge";

type CommentData = {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: { name: string; xp: number };
};

export function EventDiscussion({
  eventId,
  slug,
  comments,
  currentUserId,
  isStaff,
  isLoggedIn,
}: {
  eventId: string;
  slug: string;
  comments: CommentData[];
  currentUserId?: string;
  isStaff: boolean;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(true);
  const postAction = postEventComment.bind(null, eventId, slug);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2 className="text-sm font-semibold">💬 Diskussion ({comments.length})</h2>
        <span className="text-xs text-muted-foreground">{open ? "Ausblenden" : "Anzeigen"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-3">
              {isLoggedIn ? (
                <form action={postAction} className="flex flex-col gap-2">
                  <textarea
                    name="content"
                    required
                    rows={2}
                    placeholder="Wichtige Infos, Fragen, …"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="self-start rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-strong"
                  >
                    Senden
                  </button>
                </form>
              ) : (
                <p className="text-xs text-muted-foreground">Melde dich an, um mitzuschreiben.</p>
              )}

              <div className="mt-2 flex flex-col gap-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-t border-border pt-3 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">
                        <UserBadge name={comment.author.name} xp={comment.author.xp} />
                      </p>
                      {(comment.authorId === currentUserId || isStaff) && (
                        <form action={deleteEventComment.bind(null, comment.id, slug)}>
                          <button
                            type="submit"
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Löschen
                          </button>
                        </form>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDateTime(comment.createdAt)}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
                      {comment.content}
                    </p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-xs text-muted-foreground">Noch keine Beiträge.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
