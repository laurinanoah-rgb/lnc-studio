"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CountdownTimer } from "@/components/countdown-timer";

export function HeroSection({
  nextEvent,
}: {
  nextEvent?: { slug: string; title: string; startDate: Date } | null;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-glow pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative flex flex-col gap-10 py-24 sm:py-32 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col items-start gap-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full border border-border px-4 py-1 text-xs uppercase tracking-widest text-muted-foreground"
          >
            Community · Abenteuer · Spaß
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Willkommen bei der{" "}
            <span className="text-gradient font-extrabold">LaurinaNoahCommunity</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl text-lg text-muted-foreground"
          >
            Updates, Veranstaltungen, Gruppen und Eindrücke aus unserer Community – und der
            schnelle Weg, um bei uns PA-Boxen für dein Event anzufragen.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <LinkButton href="/registrieren" variant="gradient">
              Jetzt Mitglied werden
            </LinkButton>
            <LinkButton href="/galerie" variant="outline">
              Galerie ansehen
            </LinkButton>
          </motion.div>
        </div>

        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="w-full max-w-sm shrink-0 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Nächstes Event
            </p>
            <Link
              href={`/veranstaltungen/${nextEvent.slug}`}
              className="mt-2 block text-lg font-semibold hover:text-accent"
            >
              {nextEvent.title}
            </Link>
            <div className="mt-4">
              <CountdownTimer target={nextEvent.startDate} />
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
