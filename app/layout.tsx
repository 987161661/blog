import type { Metadata } from "next";
import { Geist, Geist_Mono, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import CursorEffect from "@/components/CursorEffect";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const maShanZheng = Ma_Shan_Zheng({
  variable: "--font-ma-shan-zheng",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zianspace.xyz'),
  title: "梓安的思维空间",
  description: "记录个人心得，灵感巧思，经验总结，项目计划，技术分享",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${maShanZheng.variable} antialiased min-h-screen flex flex-col bg-accent/20`}
      >
        <Providers>
          <CursorEffect />
          {children}
        </Providers>
      </body>
    </html>
  );
}
