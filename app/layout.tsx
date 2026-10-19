import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartProvider } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Journalist | منصة البحوث العلمية — صبراتة، ليبيا",
  description: "قائمة بحوث علمية موثقة في الطب العام وأمراض السرطان وTESOL، لكل بحث صورة غلاف ونبذة مختصرة ومختصر كامل قبل الطلب والدفع. بإدارة محمد أحمد محمد، صبراتة، ليبيا.",
  keywords: ["بحوث علمية", "ماجستير ليبيا", "رسائل دكتوراه", "Journalist", "بحوث صبراتة"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Tajawal (Arabic) — loaded in the visitor's browser; system fonts are the offline fallback */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col" style={{ fontFamily: "'Tajawal', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
