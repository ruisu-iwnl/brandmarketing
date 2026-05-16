import { getStoreSettings } from "@/lib/payload";
import { CancelContent } from "../../../components/CancelContent";

export const dynamic = 'force-dynamic';

export default async function CancelPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  const settings = await getStoreSettings();
  
  return (
    <main className="min-h-screen bg-white-calm">
      <CancelContent orderId={orderId} settings={settings} />
    </main>
  );
}
