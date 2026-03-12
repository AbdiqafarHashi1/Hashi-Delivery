import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beirut Side Sales Ledger",
  description: "Internal daily aggregate sales and sharing ledger"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
