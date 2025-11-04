import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "@/components/ui/sonner";
import { LoadingProvider } from "@/contexts/loading-context";
import { GlobalLoader } from "@/components/ui/global-loader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});


export const metadata: Metadata = {
  title: "Parle a pam's AI",
  description: "Talk  to Pam's AI Agents and discover the future of AI video calls.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <NuqsAdapter>
        <LoadingProvider>
          <TRPCProvider>
            <html lang="en">
              <head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              </head>
              <body
                className={`${inter.className} antialiased`}
              >
                <GlobalLoader />
                <Toaster />
                  {children}
              </body>
            </html>
          </TRPCProvider>
        </LoadingProvider>
      </NuqsAdapter>
    );
}
