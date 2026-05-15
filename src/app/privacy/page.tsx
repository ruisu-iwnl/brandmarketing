import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { SITE_CONFIG } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-calm selection:bg-pink-accent selection:text-foreground">
      <Navbar />
      
      <main className="flex-grow max-w-3xl mx-auto pt-40 pb-24 px-8">
        <FadeIn>
          <h1 className="text-4xl font-light mb-12 text-foreground">Privacy Policy</h1>
          
          <div className="space-y-8 text-foreground/80 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">Our Commitment</h2>
            <p>
              Your privacy is fundamental to the trust we build at {SITE_CONFIG.name}{" "}. We collect only the information necessary to process your orders and provide a seamless artisanal shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">Data Collection</h2>
            <p>
              When you join our circle or make a purchase, we collect your name, email address, and shipping details. We do not store credit card information on our servers; all payments are handled by secure, encrypted third-party processors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4 text-foreground">Your Circle Membership</h2>
            <p>
              By subscribing to our newsletter, you agree to receive stories from the artisan and release updates. You can leave the circle at any time using the link in the footer of our emails.
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
