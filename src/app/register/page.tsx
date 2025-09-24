// src/app/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const brand = {
  bg: "bg-[#8F2741]",
  bgHover: "hover:bg-[#771F36]",
  ring: "focus-visible:ring-[#E6B6C2]",
  text: "text-[#8F2741]",
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  // validação simples (client-side)
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwdOk = useMemo(() => password.length >= 6, [password]);
  const matchOk = useMemo(() => password === confirm && confirm.length > 0, [password, confirm]);
  const nameOk = useMemo(() => name.trim().length >= 2, [name]);
  const formOk = nameOk && emailOk && pwdOk && matchOk;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formOk || loading) return;
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 409) setErr("Este e-mail já está cadastrado.");
        else setErr(body?.error ?? "Erro ao registrar. Tente novamente.");
        setLoading(false);
        return;
      }

      setOk(true);
      setTimeout(() => router.push("/login"), 1000);
    } catch (e) {
      setErr("Falha de rede. Verifique sua conexão.");
      setLoading(false);
    }
  }

  // feedback automático some após alguns segundos
  useEffect(() => {
    if (err) {
      const t = setTimeout(() => setErr(null), 3500);
      return () => clearTimeout(t);
    }
  }, [err]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white p-8 border border-zinc-100">
        {/* Cabeçalho igual ao login */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-white shadow">
            <Image src="/android-chrome-192x192.png" alt="Ivoneth" width={64} height={64} />
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">
            IVONETH <span className={brand.text}>BANQUETERIA</span>
          </h1>
          <p className="text-sm text-zinc-500">Crie sua conta para continuar</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-zinc-600">Nome</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!nameOk && name.length > 0}
            />
            {!nameOk && name.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">Informe pelo menos 2 caracteres.</p>
            )}
          </div>

          <div>
            <label className="text-sm text-zinc-600">E-mail</label>
            <input
              className="mt-1 w-full h-11 rounded-xl border px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!emailOk && email.length > 0}
              required
            />
            {!emailOk && email.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">Digite um e-mail válido.</p>
            )}
          </div>

          <div>
            <label className="text-sm text-zinc-600">Senha</label>
            <div className="relative">
              <input
                className="mt-1 w-full h-11 rounded-xl border pr-10 px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
                type={showPwd ? "text" : "password"}
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!pwdOk && password.length > 0}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute inset-y-0 right-2 my-2 px-2 rounded-lg text-xs text-zinc-600 hover:bg-zinc-100"
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {!pwdOk && password.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">A senha precisa ter pelo menos 6 caracteres.</p>
            )}
          </div>

          <div>
            <label className="text-sm text-zinc-600">Confirmar senha</label>
            <div className="relative">
              <input
                className="mt-1 w-full h-11 rounded-xl border pr-10 px-3 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-300"
                type={showConfirm ? "text" : "password"}
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={!matchOk && confirm.length > 0}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-2 my-2 px-2 rounded-lg text-xs text-zinc-600 hover:bg-zinc-100"
                aria-label={showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"}
              >
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {!matchOk && confirm.length > 0 && (
              <p className="mt-1 text-xs text-amber-700">As senhas não coincidem.</p>
            )}
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {ok && <p className="text-sm text-green-700">Conta criada! Redirecionando…</p>}

          <button
            disabled={!formOk || loading}
            className={`w-full h-11 rounded-xl text-white font-semibold ${brand.bg} ${brand.bgHover} focus:outline-none focus-visible:ring-2 ${brand.ring} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-500">Já tem conta? </span>
          <Link href="/login" className={`font-medium ${brand.text} hover:underline`}>Entrar</Link>
        </div>
      </div>
    </main>
  );
}
