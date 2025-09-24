export const runtime = "nodejs";      // Prisma precisa de Node

import prisma from "@/lib/prisma";     // default import
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  const normEmail = String(email).trim();

  const exists = await prisma.user.findUnique({ where: { email: normEmail } });
  if (exists) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name: name?.trim() || null, email: normEmail, passwordHash },
    select: { id: true, email: true, name: true },
  });
  return NextResponse.json(user, { status: 201 });
}
