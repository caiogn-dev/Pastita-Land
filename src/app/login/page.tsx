// src/app/login/page.tsx
"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const brand = {
  bg: "bg-[#8F2741]",         // vinho
  bgHover: "hover:bg-[#771F36]",
  ring: "focus-visible:ring-[#E6B6C2]",
  text: "text-[#8F2741]",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if ((res as any)?.error) setErr("E-mail ou senha inválidos");
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white p-8 border border-zinc-100">
        <div className="flex flex-col items-center gap-3 mb-6">
          {/* coloque estes arquivos no /public para servir local */}
          {/* /public/ivoneth-logo.jpg (ou .svg) */}
          <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-white shadow">
            <Image src="/android-chrome-192x192.png" alt="Ivoneth" width={64} height={64} />
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">IVONETH <span className={brand.text}>BANQUETERIA</span></h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-600">E-mail</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="text-sm text-zinc-600">Senha</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            disabled={loading}
            className={`w-full h-11 rounded-xl text-white font-semibold ${brand.bg} ${brand.bgHover} focus:outline-none focus-visible:ring-2 ${brand.ring}`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Ainda não tem conta? </span>
          <Link href="/register" className={`font-medium ${brand.text} hover:underline`}>Criar conta</Link>
        </div>
      </div>
    </main>
  );
}
