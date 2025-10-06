// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // CORRECT AND ONLY PLACE FOR GLOBAL CSS IMPORT
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
 // Assuming your Navbar is directly in components/Navbar.tsx

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minibus Loan Application",
  description: "Application for minibus loans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <main className="pt-1.5"> {/* Adjust padding-top based on your navbar height */}
            {children}
          </main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}