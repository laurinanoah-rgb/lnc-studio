import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { HeroSection } from "@/components/hero-section";
import { Reveal } from "@/components/reveal";
import { formatDate } from "@/lib/format";

const quickLinks = [
  { href: "/updates", title: "📰 Updates", desc: "Neuigkeiten aus der Community." },
  { href: "/veranstaltungen", title: "🎉 Veranstaltungen", desc: "Alle Termine im Überblick." },
  { href: "/galerie", title: "📸 Galerie", desc: "Eindrücke aus unserer Community." },
  { href: "/projekte", title: "🧮 Projekte", desc: "Minecraft-Server & Discord." },
  { href: "/gruppen", title: "👨‍👨‍👦‍👦 Gruppen", desc: "Finde deine Leute." },
  { href: "/faq", title: "📚 FAQ", desc: "Häufige Fragen beantwortet." },
  { href: "/mitglieder", title: "👥 Mitglieder", desc: "Wer ist schon dabei?" },
  { href: "/anfrage", title: "🔊 PA-Boxen", desc: "Lautsprecher fürs Event anfragen." },
];

export default async function HomePage() {
  const [latestPosts, upcomingEvents, galleryPreview] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.event.findMany({
      where: {
        published: true,
        startDate: { gte: new Date() },
        OR: [{ groupId: null }, { group: { is: { public: true } } }],
      },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
      take: 4,
    }),
  ]);

  return (
    <>
      <HeroSection nextEvent={upcomingEvents[0] ?? null} />

      <Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item, index) => (
          <Reveal key={item.href} delay={(index % 4) * 0.05}>
            <Link href={item.href}>
              <Card className="h-full transition-colors hover:bg-surface-hover">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </Container>

      <Container className="grid gap-12 py-8 lg:grid-cols-2">
        <Reveal>
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Neueste Updates</h2>
              <Link href="/updates" className="text-sm text-accent hover:underline">
                Alle Updates
              </Link>
            </div>
            {latestPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Beiträge veröffentlicht.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {latestPosts.map((post) => (
                  <Link key={post.id} href={`/updates/${post.slug}`}>
                    <Card className="transition-colors hover:bg-surface-hover">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </p>
                      <h3 className="mt-1 font-medium">{post.title}</h3>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </Reveal>

        <Reveal delay={0.1}>
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Kommende Veranstaltungen</h2>
              <Link href="/veranstaltungen" className="text-sm text-accent hover:underline">
                Alle Termine
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aktuell sind keine Termine geplant.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <p className="text-xs text-accent">{formatDate(event.startDate)}</p>
                    <h3 className="mt-1 font-medium">{event.title}</h3>
                    {event.location && (
                      <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>
        </Reveal>
      </Container>

      {galleryPreview.length > 0 && (
        <Reveal>
          <Container className="py-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Aus der Galerie</h2>
              <Link href="/galerie" className="text-sm text-accent hover:underline">
                Zur Galerie
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryPreview.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image.id}
                  src={image.url}
                  alt={image.title ?? ""}
                  className="aspect-square w-full rounded-xl border border-border object-cover"
                />
              ))}
            </div>
          </Container>
        </Reveal>
      )}
    </>
  );
}
