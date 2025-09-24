import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";       // ✅ IMPORT DE VALOR (NÃO type)
import { verifyPassword } from "@/lib/password";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),            // ✅ usa o mesmo prisma
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user?.passwordHash) return null;
        const ok = await verifyPassword(user.passwordHash, creds.password);
        return ok ? { id: user.id, email: user.email, name: user.name, role: user.role } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string | undefined;
        (session.user as any).role = token.role as any;
      }
      return session;
    },
  },
};
