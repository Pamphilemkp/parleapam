import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";

const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Parle a pam's AI",
  description: "Talk  to Pam's AI Agents and discover the future of AI video calls.",
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <NuqsAdapter>
      <TRPCProvider>
        <html lang="en">
          <body
            className={`${inter.className} antialiased`}
          >
            <Toaster />
            <Navbar />
              {children}
            <Footer />
          </body>
        </html>
    </TRPCProvider>
    </NuqsAdapter>
    );
}
