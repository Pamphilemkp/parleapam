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

/**
 * Provides the global layout for the application, including font styles, tRPC context, and a toast notification system.
 *
 * Wraps all page content with the Inter font, applies antialiasing, and ensures that toast notifications and tRPC context are available throughout the app.
 *
 * @param children - The content to be rendered within the layout
 */
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
