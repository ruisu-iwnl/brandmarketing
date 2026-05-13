"use client";

import { useEffect } from "react";
import ProvenanceMap from "@/components/ProvenanceMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FadeIn from "@/components/FadeIn";
import { MessageCircle, Mail } from "lucide-react";

const FacebookIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

export default function Home() {
  useEffect(() => {
    // Handle cross-page scrolling without hashes
    const targetId = sessionStorage.getItem("scrollTarget");
    if (targetId) {
      // Small delay to ensure the DOM is ready and animations have started
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.removeItem("scrollTarget");
      }, 100);
    }

    // Also clear any legacy hashes
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-accent selection:text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4 bg-pink-calm pt-20">
        <FadeIn delay={0.2} className="flex flex-col items-center">
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-foreground">
            Pamana.
          </h1>
          <p className="text-lg md:text-xl font-light max-w-xl mb-10 text-foreground/80">
            Handwoven elegance from the Philippine islands. Necklaces and bracelets crafted by local artisans using shells, beads, and ancestral techniques.
          </p>
          <button 
            onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-foreground text-white-calm px-8 py-4 uppercase tracking-widest text-sm hover:bg-foreground/90 transition-all"
          >
            View Pieces
          </button>
        </FadeIn>
      </section>

      {/* Brand Story */}
      <section id="story" className="py-32 px-4 flex justify-center bg-white-calm">
        <FadeIn className="max-w-2xl text-center">
          <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent">Our Roots</h2>
          <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground">
            Every piece carries the warmth of the sun and the rhythm of the sea. We partner directly with craftsmen in Cebu and Palawan to translate island heritage into delicate, wearable art.
          </p>
        </FadeIn>
      </section>

      {/* PROVENANCE MAP SECTION */}
      <FadeIn delay={0.1}>
        <ProvenanceMap />
      </FadeIn>

      {/* Product Gallery (Placeholder) */}
      <section id="shop" className="py-24 px-8 bg-background">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-light text-foreground">The Collection</h2>
            <button className="text-sm uppercase tracking-wider border-b border-foreground pb-1 hover:text-pink-accent hover:border-pink-accent transition-all">
              Filter / Sort
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {/* Product 1 */}
            <FadeIn delay={0.1} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                {/* Primary Image Placeholder */}
                <div className="absolute inset-0 bg-white-calm flex items-center justify-center transition-opacity duration-700 group-hover:opacity-0 z-10">
                  <span className="text-pink-accent text-sm tracking-widest uppercase opacity-50">Product Image</span>
                </div>
                {/* Secondary Hover Reveal Image Placeholder */}
                <div className="absolute inset-0 bg-pink-calm flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                  <span className="text-foreground text-sm tracking-widest uppercase opacity-70">Worn View Reveal</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium">Capiz Shell Choker</h3>
                <span className="font-light">$45</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 font-light">Iridescent coastal shell</p>
            </FadeIn>

            {/* Product 2 */}
            <FadeIn delay={0.2} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-white-calm flex items-center justify-center transition-opacity duration-700 group-hover:opacity-0 z-10">
                  <span className="text-pink-accent text-sm tracking-widest uppercase opacity-50">Product Image</span>
                </div>
                <div className="absolute inset-0 bg-pink-calm flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                  <span className="text-foreground text-sm tracking-widest uppercase opacity-70">Worn View Reveal</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium">Woven Gold Bangle</h3>
                <span className="font-light">$60</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 font-light">Intricate wire artistry</p>
            </FadeIn>

            {/* Product 3 */}
            <FadeIn delay={0.3} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-white-calm flex items-center justify-center transition-opacity duration-700 group-hover:opacity-0 z-10">
                  <span className="text-pink-accent text-sm tracking-widest uppercase opacity-50">Product Image</span>
                </div>
                <div className="absolute inset-0 bg-pink-calm flex items-center justify-center scale-105 group-hover:scale-100 transition-transform duration-700">
                  <span className="text-foreground text-sm tracking-widest uppercase opacity-70">Worn View Reveal</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium">Palawan Pearl Drop</h3>
                <span className="font-light">$85</span>
              </div>
              <p className="text-sm text-foreground/70 mt-2 font-light">Sourced from southern waters</p>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 bg-white-calm border-t border-pink-accent/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
          <FadeIn className="flex-1">
            <h2 className="text-3xl font-light mb-8 text-foreground">Inquiries</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground"
                  required
                />
              </div>
              <textarea 
                placeholder="How can we help you?" 
                rows={5}
                className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground resize-none"
                required
              />
              <button 
                type="submit" 
                className="bg-foreground text-white-calm px-10 py-4 uppercase tracking-widest text-sm hover:bg-foreground/90 transition-all w-full md:w-auto"
              >
                Send Message
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.2} className="w-full md:w-72 flex flex-col justify-center items-center md:items-start text-center md:text-left border-t md:border-t-0 md:border-l border-pink-accent/20 pt-12 md:pt-0 md:pl-12">
            <h3 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent font-medium">Connect With Us</h3>
            <div className="flex gap-8 mb-8">
              <a href="#" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Facebook">
                <FacebookIcon size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="WhatsApp">
                <MessageCircle size={22} strokeWidth={1.5} />
              </a>
              <a href="mailto:hello@mutya.com" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Email">
                <Mail size={22} strokeWidth={1.5} />
              </a>
            </div>
            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              For custom commissions, artisan collaborations, or private collection previews.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <ScrollToTop />
    </div>
  );
}
