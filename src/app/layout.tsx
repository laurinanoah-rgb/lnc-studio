import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LevelUpCelebration } from "@/components/level-up-celebration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LNC",
    template: "%s · LNC",
  },
  description: "LaurinaNoahCommunity – Updates, Veranstaltungen, Gruppen, Galerie und mehr.",
  icons: {
    icon: "/branding/logo.png",
    apple: "/branding/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { pendingLevelUp: true, neonModeEnabled: true },
      })
    : null;

  const pendingLevelUp = user?.pendingLevelUp as { level: number; unlocks: string[] } | null;

  return (
    <html
      lang="de"
      data-neon={user?.neonModeEnabled ? "true" : undefined}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <LevelUpCelebration pending={pendingLevelUp ?? null} />
      </body>
    </html>
  );
}
