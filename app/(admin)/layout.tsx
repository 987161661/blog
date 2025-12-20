import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      
      <main className="flex-grow">
        {/* Full width container for admin */}
        {children}
      </main>

      <Footer />
    </>
  );
}
