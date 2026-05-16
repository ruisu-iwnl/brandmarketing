import { getStoreSettings } from "@/lib/payload";
import { CancelContent } from "@/components/pages/CancelContent";

export const dynamic = 'force-dynamic';

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ orderId?: string, isDonation?: string }> }) {
  const { orderId, isDonation } = await searchParams;
  const settings = await getStoreSettings();
  
  return (
    <main className="min-h-screen bg-white-calm">
      <CancelContent orderId={orderId} isDonation={isDonation === 'true'} settings={settings} />
    </main>
  );
}
