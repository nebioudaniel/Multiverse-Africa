import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { getServerSession } from "next-auth/next"; // ✅ CORRECT
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // ✅ v4-compatible

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
