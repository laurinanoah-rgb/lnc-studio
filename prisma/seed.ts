import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedManager() {
  const email = process.env.SEED_MANAGER_EMAIL ?? "admin@lnc-studio.de";
  const password = process.env.SEED_MANAGER_PASSWORD ?? "LNCStudio2026!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Manager-Account existiert bereits: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: "Manager",
      email,
      passwordHash,
      role: "MANAGER",
    },
  });

  console.log("Manager-Account angelegt:");
  console.log(`  E-Mail:   ${email}`);
  console.log(`  Passwort: ${password}`);
  console.log("Bitte nach dem ersten Login das Passwort im Benutzer-Bereich ändern.");
}

async function seedAnfrageSettings() {
  await prisma.anfrageSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

async function seedSiteContent() {
  await prisma.siteContent.upsert({
    where: { key: "info" },
    update: {},
    create: {
      key: "info",
      title: "Unsere Geschichte",
      body: "Laurina gründete die LaurinaNoahCommunity (LNC) an einem regnerischen Nachmittag, um Menschen zusammenzubringen und Spaß zu verbreiten. Heute ist LNC ein lebendiger Ort voller Geschichten, Lachen und Gemeinschaft. Jeder ist willkommen, seinen Beitrag zu leisten.\n\nSchnapp dir eine Tasse Kaffee (oder Tee 😉) und werde Teil der LaurinaNoahCommunity. Gemeinsam lachen wir am besten!",
    },
  });
}

async function seedProjects() {
  const count = await prisma.project.count();
  if (count > 0) return;

  await prisma.project.createMany({
    data: [
      {
        title: "Minecraft-Server: ERZMARK",
        description:
          "Unser eigener Minecraft-Server für die Community. Baue mit, erlebe Abenteuer und werde Teil von Erzmark.",
        linkLabel: "Mehr erfahren",
        linkUrl: "",
        icon: "⛏️",
        order: 0,
      },
      {
        title: "Discord",
        description:
          "In Discord kannst du mit anderen kommunizieren, Bildschirm übertragen und dich in Textkanälen austauschen. Sammle Coins/Punkte und Level für weitere Vorteile.",
        linkLabel: "Discord beitreten",
        linkUrl: "",
        icon: "💬",
        order: 1,
      },
    ],
  });
}

async function seedFaq() {
  const count = await prisma.faqItem.count();
  if (count > 0) return;

  await prisma.faqItem.createMany({
    data: [
      {
        category: "Minecraft-Server - ERZMARK",
        question: "Wie komme ich auf den Minecraft-Server?",
        answer: "Details folgen in Kürze.",
        order: 0,
      },
      {
        category: "Minecraft-Server - ERZMARK",
        question: "Was ist Erzmark?",
        answer: "Details folgen in Kürze.",
        order: 1,
      },
      {
        category: "Discord-Server - LNC",
        question: "Wie kann ich dem Discord-Server beitreten?",
        answer: "Details folgen in Kürze.",
        order: 0,
      },
      {
        category: "Homepage",
        question: "Wie kann ich die Community unterstützen?",
        answer: "Details folgen in Kürze.",
        order: 0,
      },
    ],
  });
}

async function main() {
  await seedManager();
  await seedAnfrageSettings();
  await seedSiteContent();
  await seedProjects();
  await seedFaq();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
