import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Cinzel } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Realmwright",
  description: "Worldbuilding tool for GMs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${cinzel.variable}`}>
      <body className="bg-background-main text-foreground-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
