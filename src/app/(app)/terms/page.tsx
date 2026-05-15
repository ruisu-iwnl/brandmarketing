import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { SITE_CONFIG } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-calm selection:bg-pink-accent selection:text-foreground">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto pt-40 pb-24 px-8">
        <FadeIn>
          <h1 className="text-4xl font-light mb-12 text-foreground">Terms of Service</h1>

          <div className="space-y-8 text-foreground/80 font-light leading-relaxed">
            <section>
              <h2 className="text-xl font-medium mb-4 text-foreground">1. Artisanal Nature</h2>
              <p>
                Each piece at {SITE_CONFIG.name}{" "}is meticulously handcrafted by a single artisan. Due to the natural materials and handmade process, slight variations in color, shape, and size are to be expected and celebrated as part of the item&apos;s unique character.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4 text-foreground">2. Ordering & Shipping</h2>
              <p>
                Most of our pieces are made in limited batches. Please allow 3-5 business days for processing. International shipping times vary by destination and local customs procedures.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium mb-4 text-foreground">3. Care & Responsibility</h2>
              <p>
                Our jewelry uses delicate natural materials and hand-woven elements. {SITE_CONFIG.name}{" "}is not responsible for damage caused by improper handling or lack of care as outlined in our care instructions.
              </p>
            </section>

            <section>
              <p className="mt-12 text-sm italic">Last updated: May 13, 2026</p>
            </section>
          </div>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
}
