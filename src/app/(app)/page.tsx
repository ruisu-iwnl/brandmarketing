import HomeContent from "@/components/HomeContent";
import { getProducts, getHeroSlides } from "@/lib/payload";
import { heroProductsData } from "@/components/sections/Hero";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data on the server - This is instant and has ZERO flicker
  const [products, slides] = await Promise.all([
    getProducts(),
    getHeroSlides()
  ]);

  // If slides are empty in CMS, we use the fallback once on the server
  const finalSlides = slides.length > 0 ? slides : heroProductsData;

  return <HomeContent products={products} slides={finalSlides} />;
}
