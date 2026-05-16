import { getStoreSettings } from "@/lib/payload";
import { SuccessContent } from "@/components/pages/SuccessContent";

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ orderId?: string, isDonation?: string }> }) {
  const { orderId, isDonation } = await searchParams;
  const settings = await getStoreSettings();
  
  return (
    <main className="min-h-screen bg-white-calm">
      <SuccessContent 
        orderId={orderId} 
        settings={settings} 
        isDonation={isDonation === 'true'} 
      />
    </main>
  );
}
