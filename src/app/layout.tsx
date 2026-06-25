import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-google",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif-google",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Capri & Ovis - Excelência em Ovinocaprinocultura",
  description: "Portal de Gerenciamento, Controle e Seleção Genética de Ovinos e Caprinos. Referência em biotecnologia e melhoramento genético.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${lora.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-la text-cabrito font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
