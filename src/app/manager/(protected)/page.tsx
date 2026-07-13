import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function ManagerDashboardPage() {
  const [postCount, upcomingEventCount, newInquiryCount, imageCount] = await Promise.all([
    prisma.post.count(),
    prisma.event.count({ where: { startDate: { gte: new Date() } } }),
    prisma.inquiryRequest.count({ where: { status: "NEU" } }),
    prisma.galleryImage.count(),
  ]);

  const stats = [
    { href: "/manager/updates", label: "Beiträge", value: postCount },
    { href: "/manager/veranstaltungen", label: "Kommende Veranstaltungen", value: upcomingEventCount },
    { href: "/manager/anfragen", label: "Neue Anfragen", value: newInquiryCount },
    { href: "/manager/galerie", label: "Galerie-Bilder", value: imageCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Überblick über die LaurinaNoahCommunity.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="transition-colors hover:bg-surface-hover">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
