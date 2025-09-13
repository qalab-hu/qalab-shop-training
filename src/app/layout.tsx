import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QALab Shop - Learn Playwright Testing",
  description: "A demo e-commerce site designed for learning Playwright automation testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-grow" role="main" aria-label="Main content">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
