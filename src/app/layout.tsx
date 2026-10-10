import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IG Command Center",
  description: "Manage multiple Instagram accounts from one dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0d12] text-[#e8eaed] antialiased">
        {children}
      </body>
    </html>
  );
}
