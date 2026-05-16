import HomeContent from "@/components/pages/HomeContent";
import { getProducts, getHeroSlides, getStoreSettings } from "@/lib/payload";
import { heroProductsData } from "@/components/sections/Hero";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data on the server - This is instant and has ZERO flicker
  const [products, slides, settings] = await Promise.all([
    getProducts(),
    getHeroSlides(),
    getStoreSettings()
  ]);

  // If slides are empty in CMS, we use the fallback once on the server
  const finalSlides = slides.length > 0 ? slides : heroProductsData;

  return <HomeContent products={products} slides={finalSlides} settings={settings} />;
}
