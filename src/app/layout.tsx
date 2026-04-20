import type { Metadata } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Noli Me Tangere - HiLiSiBu",
  description: "Filipino Reading App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${greatVibes.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
