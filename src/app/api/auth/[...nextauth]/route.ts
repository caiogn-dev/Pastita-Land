import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

export const dynamic = "force-dynamic";     // evita tentativa de pré-render
export const fetchCache = "force-no-store"; // idem

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
