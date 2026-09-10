"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function GetToKnowUsTeaser() {
  return (
    <div className="relative">
      <section id="gettoknowus" className="scroll-mt-[72px] py-32 px-8 bg-white-calm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-32">
          <div className="flex-1">
            <FadeIn>
              <span className="text-[10px] uppercase tracking-[0.3em] text-pink-accent mb-6 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-light leading-tight text-foreground mb-8">
                Made by one person.<br />
                For one person.
              </h2>
              <p className="text-base font-light leading-relaxed text-foreground/60 max-w-sm mb-10">
                Learn about our handmade jewelry, the way we make each piece, and the hands that do the work.
              </p>
              <Link 
                href="/gettoknowus"
                className="inline-block bg-pink-accent text-foreground px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-pink-accent/20"
              >
                Get to Know Us
              </Link>
            </FadeIn>
          </div>
          <div className="flex-1 relative aspect-square w-full max-w-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/products/worn/aquamarine.webp"
              alt="Artisan at work"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
