import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { InquiryPdfDocument } from "@/lib/inquiry-pdf";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role === "MITGLIED") {
    return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 });
  }

  const { id } = await params;
  const inquiry = await prisma.inquiryRequest.findUnique({ where: { id } });

  if (!inquiry) {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }

  const buffer = await renderToBuffer(<InquiryPdfDocument inquiry={inquiry} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="anfrage-${inquiry.id}.pdf"`,
    },
  });
}
