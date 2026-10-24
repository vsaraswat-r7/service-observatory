import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Observatory — Your Company Here",
  description:
    "Company-agnostic service observability platform. Neo4j knowledge graph + MCP tools for AI agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Sidebar />
          <main className="ml-60 min-h-screen p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
