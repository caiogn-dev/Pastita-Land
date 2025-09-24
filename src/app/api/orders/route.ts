import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ agora bate com o auth.ts

type Payload = {
  brand: "pastita" | "agriao";
  customer?: { name?: string; phone?: string; email?: string | null };
  items: Array<{ id: string; name: string; price: number; qty: number; imageUrl?: string }>;
  notes?: string;
};

// (Opcional) tenta sessão v4; se não existir, segue sem userId
async function getUserIdSafe(): Promise<string | undefined> {
  try {
    const { getServerSession } = await import("next-auth");
    const { authConfig } = await import("@/lib/auth");
    const session = await getServerSession(authConfig as any);
    return (session?.user as any)?.id as string | undefined;
  } catch {
    return undefined;
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as Payload;

  if (!body?.brand || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const userId = await getUserIdSafe();

  const totalCents = body.items.reduce(
    (acc, it) => acc + Math.round((it.price ?? 0) * 100) * (it.qty ?? 1),
    0
  );

  const order = await prisma.order.create({
    data: {
      brand: body.brand,
      totalCents,
      notes: body.notes ?? null,
      userId: userId ?? null,
      contactName: body.customer?.name ?? null,
      contactEmail: body.customer?.email?.toLowerCase() ?? null,
      contactPhone: body.customer?.phone ?? null,
      items: {
        create: body.items.map((it) => ({
          itemSlug: it.id,
          itemName: it.name,
          unitPriceCents: Math.round((it.price ?? 0) * 100),
          qty: it.qty ?? 1,
          imageUrl: it.imageUrl ?? null,
        })),
      },
    },
    select: { id: true, brand: true, totalCents: true, status: true, createdAt: true },
  });

  return NextResponse.json(order, { status: 201 });
}
