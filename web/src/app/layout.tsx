import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/feedback/toast";
import { MockBoot } from "@/mocks/boot";
import { Topbar } from "@/components/header/topbar";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/compliance/cookie-banner";
import React from "react";

const libreFranklin = Libre_Franklin({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Visão da Vila Store — Mockup",
    template: "%s | Visão da Vila",
  },
  description: "Mockup de e-commerce inspirado em Xandão Outlet",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Visão da Vila Store",
    title: "Visão da Vila Store — Mockup",
    description: "Mockup de e-commerce inspirado em Xandão Outlet",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visão da Vila Store — Mockup",
    description: "Mockup de e-commerce inspirado em Xandão Outlet",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${libreFranklin.variable} font-sans antialiased`}>
        {/* Aplicar tema salvo antes da hidratação para evitar flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem('pref:theme') || 'light';
    document.documentElement.dataset.theme = t;
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();
          `,
          }}
        />
        <a href="#conteudo" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 rounded bg-zinc-900 px-3 py-2 text-sm text-white">
          Pular para o conteúdo
        </a>
        <MockBoot />
        <Topbar />
        <Header />
        <ToastProvider>
          <div id="conteudo">{children}</div>
          <Footer />
        </ToastProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
