import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
// Update the import path if the file is located elsewhere, for example:
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Parle a pam's AI",
  description: "Talk  to Pam's AI Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCProvider>
      <html lang="en">
        <body
          className={`${inter.className} antialiased`}
        >
          <Toaster />
          {children}
        </body>
      </html>
  </TRPCProvider>
  );
}
