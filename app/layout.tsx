import type { Metadata } from "next";
import { Geist, Geist_Mono, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import CursorEffect from "@/components/CursorEffect";

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
  preload: false, // Preloading might fail for Chinese fonts sometimes if subsets are tricky, but let's try false to be safe or just standard
});

export const metadata: Metadata = {
  title: "梓安的思维空间",
  description: "记录个人心得，灵感巧思，经验总结，项目计划，技术分享",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${maShanZheng.variable} antialiased min-h-screen flex flex-col bg-accent/20`}
      >
        <CursorEffect />
        <Header />
        
        <main className="flex-grow container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area (75%) */}
            <div className="lg:col-span-3 space-y-8">
              {children}
            </div>
            
            {/* Sidebar Area (25%) */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}
