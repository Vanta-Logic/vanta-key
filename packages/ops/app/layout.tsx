import "./globals.css";
import type { ReactNode } from "react";

export const metadata = { title: "Vanta-Key Ops" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <header className="border-b border-gray-800 px-6 py-4 text-lg font-semibold">
          VantaLogic / Ops
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
