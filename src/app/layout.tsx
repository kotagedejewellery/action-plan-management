import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FeedbackProvider } from "@/presentation/components/feedback";

export const metadata: Metadata = {
  title: "Action Plan | Workspace",
  description: "Action Plan Management System",
  icons: {
    icon: { url: "/icon.png", sizes: "512x512", type: "image/png" },
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    other: { rel: "mask-icon", url: "/kotagede-pinned-tab.svg", color: "#173c3a" },
  },
};

export const viewport: Viewport = { themeColor: "#173c3a" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><FeedbackProvider>{children}</FeedbackProvider></body>
    </html>
  );
}
