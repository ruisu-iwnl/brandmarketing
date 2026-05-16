import { getStoreSettings } from "@/lib/payload";
import { SupportContent } from "@/components/pages/SupportContent";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const settings = await getStoreSettings();
  
  return (
    <main className="min-h-screen bg-white-calm selection:bg-pink-accent/30">
      <Navbar />
      <SupportContent settings={settings} />
      <Footer />
    </main>
  );
}
