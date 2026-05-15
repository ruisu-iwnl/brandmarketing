"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import ScrollToTop from "@/components/ScrollToTop";
import { ChevronLeft, Sparkles, Heart, Box, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProvenanceMap from "@/components/ProvenanceMap";
import { SITE_CONFIG } from "@/lib/constants";

export default function GetToKnowUs() {
  return (
    <div className="min-h-screen bg-white-calm selection:bg-pink-accent/30 font-sans">
      <Navbar />
      
      <main className="pt-20">
        {/* Editorial Hero */}
        <section className="relative h-[70vh] flex flex-col items-center justify-center text-center px-8 bg-white overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-accent/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <FadeIn>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-pink-accent mb-12 hover:opacity-70 transition-opacity"
              >
                <ChevronLeft size={12} /> Return Home
              </Link>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-8xl font-light tracking-tight text-foreground mb-8 leading-[1.1]">
                Made by hand.<br />
                <span className="italic font-serif text-pink-accent">Made to last.</span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="w-12 h-[1px] bg-pink-accent mx-auto mb-8" />
              <p className="text-sm md:text-base text-foreground/40 font-light tracking-widest uppercase">
                The story of {SITE_CONFIG.name}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Chapter 1: The Hands */}
        <section className="py-32 md:py-48 px-8 bg-white-calm">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
              <div className="md:col-span-7">
                <FadeIn>
                  <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-10">
                    A single pair of hands for every single piece.
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-lg font-light leading-relaxed text-foreground/60 mb-8">
                    Every piece we make starts as a thought and ends as something you can hold. We do not use big shops or machines. It is just one person, one vision, and the hard work needed to make art.
                  </p>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div className="flex gap-12 pt-8">
                    <div>
                      <span className="block text-2xl font-light text-foreground mb-1">01</span>
                      <span className="text-[10px] uppercase tracking-widest text-pink-accent">Maker</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-light text-foreground mb-1">100%</span>
                      <span className="text-[10px] uppercase tracking-widest text-pink-accent">Handmade</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-light text-foreground mb-1">∞</span>
                      <span className="text-[10px] uppercase tracking-widest text-pink-accent">Care</span>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <div className="md:col-span-5 flex justify-center">
                <FadeIn delay={0.4}>
                  <div className="relative w-full aspect-square md:w-[400px] md:h-[400px] rounded-[32px] overflow-hidden shadow-2xl shadow-pink-accent/10 group">
                    <div className="absolute inset-0 bg-pink-accent/5 z-0" />
                    <Image 
                      src="/images/products/worn/amethyst.png"
                      alt="Handcrafted jewelry detail"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 border border-white/20 z-10 rounded-[32px]" />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 2: The Materials */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <FadeIn>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-pink-accent mb-6">
                  <MapPin size={12} /> Origin
                </span>
                <h2 className="text-3xl md:text-6xl font-light text-foreground mb-8">Raw Materials</h2>
                <p className="text-sm text-foreground/40 font-light max-w-xl mx-auto leading-relaxed">
                  Every stone is picked for its color and feel. We look for pieces that have their own life and beauty.
                </p>
              </FadeIn>
            </div>

            <FadeIn delay={0.2}>
              <div className="w-full">
                <ProvenanceMap />
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Chapter 3: Our Promise */}
        <section className="py-32 md:py-48 px-8 bg-white-calm overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {[
                {
                  title: "Handmade",
                  icon: <Sparkles size={24} className="text-pink-accent mb-6" />,
                  body: "Every piece is made by hand with real care. No two pieces are ever the same — and that is how it should be."
                },
                {
                  title: "Good things",
                  icon: <Heart size={24} className="text-pink-accent mb-6" />,
                  body: "We only use the best stones and strings. We pick them for their beauty and how they work together."
                },
                {
                  title: "Stays nice",
                  icon: <Box size={24} className="text-pink-accent mb-6" />,
                  body: "Made to be worn for a long time. These pieces do not follow trends but are made to stay nice for years."
                }
              ].map((pillar, i) => (
                <FadeIn key={pillar.title} delay={0.1 * i} className="flex-1">
                  <div className="h-full p-10 bg-white rounded-3xl border border-pink-accent/5 hover:border-pink-accent/20 transition-all group">
                    {pillar.icon}
                    <h3 className="text-xl font-light text-foreground mb-4 uppercase tracking-widest">{pillar.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-foreground/50">{pillar.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Final Statement & Call to Action */}
        <section className="py-48 px-8 text-center relative overflow-hidden bg-white">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-pink-accent/5 rounded-t-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto relative z-10">
            <FadeIn>
              <blockquote className="mb-20">
                <p className="text-2xl md:text-5xl font-light leading-relaxed text-foreground italic font-serif">
                  "We don't just sell jewelry. We share a part of our work, our hands, and our heart with the world."
                </p>
              </blockquote>
              
              <Link 
                href="/#shop"
                className="inline-block bg-foreground text-white-calm px-12 py-5 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-pink-accent hover:text-foreground transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                Back to the Collection
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
