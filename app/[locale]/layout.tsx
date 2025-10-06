// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // For displaying toast notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minibus Registration App",
  description: "Register for your electric minibus here.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex-grow">
          {children}
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}