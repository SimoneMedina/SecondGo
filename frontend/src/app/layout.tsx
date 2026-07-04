import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SecondGo",
  description: "Plataforma de comercio SecondGo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-green-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          {/* Añadimos un contenedor principal con más aire */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 md:p-8">
              {children}
            </div>
          </main>
          <footer className="py-6 text-center text-sm text-green-700">
            SecondGo © 2026 - Moda Sostenible
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}