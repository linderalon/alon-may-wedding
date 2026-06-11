import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/lang-context";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const garamond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Alon & May — Wedding",
  description: "Join us to celebrate our wedding — October 14th, 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${garamond.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-full"><LangProvider>{children}</LangProvider></body>
    </html>
  );
}
