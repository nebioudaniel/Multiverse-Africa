import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";

const inter = Inter({ subsets: ["latin"] });

// Public marketing pages are fully static (SSG): no server session is read here,
// so routes under this layout are pre-rendered at build time and served from
// Cloudflare Workers Static Assets (zero per-request CPU). Admin routes
// (/admin/*) remain fully dynamic because app/admin/layout.tsx uses
// getServerSession (a dynamic API), which forces those routes to render on the
// server.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
