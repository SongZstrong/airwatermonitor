import type { Metadata } from "next";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Air & Water Observatory",
  description:
    "Live open-data dashboards that compare air quality and water safety on every continent.",
  metadataBase: new URL("https://airwatergov.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">
            Data sources: OpenAQ, World Bank, Rest Countries. Updated hourly
            where live APIs allow.
          </div>
        </footer>
      </body>
    </html>
  );
}
