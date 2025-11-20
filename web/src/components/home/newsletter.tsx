"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/feedback/toast";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const { show } = useToast();

  function isValidEmail(v: string) {
    return /.+@.+\..+/.test(v);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      const text = "Digite um e-mail válido.";
      setMessage({ type: "error", text });
      show({ title: "E-mail inválido", message: text, variant: "error" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEmail("");
    const text = "Você receberá novidades em breve.";
    setMessage({ type: "success", text });
    show({ title: "Inscrito!", message: text, variant: "success" });
  };

  return (
    <section className="mt-12 rounded-[var(--radius-lg)] border border-zinc-200 p-6">
      <h3 className="heading-3">Assine nossa newsletter</h3>
      <p className="text-body mt-1 text-zinc-600">Receba ofertas e lançamentos por e-mail.</p>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2 max-sm:flex-col" noValidate>
        <Input
          type="email"
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="E-mail"
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Assinar"}
        </Button>
        {/* Mensagens inline acessíveis */}
        <span role="status" aria-live="polite" className="sr-only">
          {message?.text ?? ""}
        </span>
      </form>
      <p className={`mt-2 text-sm ${message?.type === "error" ? "text-red-600" : "text-zinc-600"}`}>
        {message?.type === "error" ? (
          message.text
        ) : (
          <>
            Não enviamos spam. Você pode se descadastrar quando quiser. Leia nossa
            <a href="/politica-de-privacidade" className="ml-1 link-underline">política de privacidade</a>.
          </>
        )}
      </p>
    </section>
  );
}
