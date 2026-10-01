import type { Metadata } from "next";
import "./globals.css";
import { FeedbackProvider } from "@/presentation/components/feedback";

export const metadata: Metadata = {
  title: "Action Plan | Workspace",
  description: "Action Plan Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><FeedbackProvider>{children}</FeedbackProvider></body>
    </html>
  );
}
