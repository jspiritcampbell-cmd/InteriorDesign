import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "AI Interior Design Assistant",
  description: "Vibe-code an AI interior designer and deploy on Vercel"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200">
          <div className="container py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">AI Interior Design Assistant</h1>
            <a
              href="https://vercel.com/docs"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-slate-600 hover:underline"
            >
              Deployed on Vercel
            </a>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
