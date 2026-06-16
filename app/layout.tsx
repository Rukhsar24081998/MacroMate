import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "MacroMate — Meal Nutrition Calculator",
  description:
    "Build custom meals and calculate calories and macronutrients using USDA FoodData Central.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-surface text-gray-900 antialiased">
        <Header />
        <main className="mx-auto w-full flex-1 px-4 py-4 lg:px-6 lg:py-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
