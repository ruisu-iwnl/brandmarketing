import { getStoreSettings } from "@/lib/payload";
import { CheckoutContent } from "@/components/pages/CheckoutContent";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  
  return (
    <main className="min-h-screen bg-white-calm">
      <CheckoutContent settings={settings} />
    </main>
  );
}
