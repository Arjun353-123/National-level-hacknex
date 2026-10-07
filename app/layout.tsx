import type { Metadata } from "next";
import "./globals.css";
import "../components/three-ui/threeui.css";
import { CursorEffect } from "@/components/CursorEffect";

export const metadata: Metadata = {
  title: "Multimodal Medical Image Intelligence",
  description: "Advanced AI-powered medical imaging analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CursorEffect />
        {children}
      </body>
    </html>
  );
}
