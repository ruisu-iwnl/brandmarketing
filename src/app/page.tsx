"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import ProvenanceMap from "@/components/ProvenanceMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FadeIn from "@/components/FadeIn";
import { MessageCircle, Mail } from "lucide-react";

const FacebookIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 60 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const moveX = useTransform(springX, [-0.5, 0.5], ["-0.5%", "0.5%"]);
  const moveY = useTransform(springY, [-0.5, 0.5], ["-0.5%", "0.5%"]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, mass: 0.5 });

  const imgScale = useTransform(smoothProgress, [0, 1], [0.75, 0.30]);
  const imgX = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["0%", "-5%", "3%", "0%"]);
  const imgY = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ["0%", "2vh", "15vh", "30vh"]);
  const imgRotate = useTransform(smoothProgress, [0, 1], ["0deg", "-12deg"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const targetId = sessionStorage.getItem("scrollTarget");
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        sessionStorage.removeItem("scrollTarget");
      }, 100);
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-accent selection:text-foreground">
      <Navbar />

      <motion.div ref={wrapperRef} className="relative w-full z-20">

        <div className="sticky top-0 h-screen w-full pointer-events-none z-10 hidden md:block overflow-hidden">
          <motion.div
            style={{
              y: imgY,
              x: imgX,
              scale: imgScale,
              rotate: imgRotate,
            }}
            className="absolute inset-0 flex justify-center items-center"
          >
            <motion.div
              style={{ x: moveX, y: moveY }}
              initial={{ opacity: 0 }}
              animate={{ scale: [1, 1.05, 1], opacity: 1 }}
              transition={{ scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1.5 } }}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="relative w-[120%] h-[120%] md:w-full md:h-full max-w-[1400px]">
                <Image
                  src="/images/hero.png"
                  alt="Joulery Creative Handcrafted Items"
                  fill
                  priority
                  className="object-contain object-center"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute top-0 left-0 w-full h-screen z-0 md:hidden overflow-hidden pointer-events-none">
          <Image
            src="/images/hero.png"
            alt="Joulery Creative Handcrafted Items"
            fill
            className="object-contain scale-90"
          />
        </div>

        <div className="relative md:-mt-[100vh]">

          <section className="h-screen flex flex-col justify-center items-center text-center px-4 pt-20 relative z-20">
            <FadeIn delay={0.2} className="flex flex-col items-center">
              <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 text-foreground">
                <span className="bg-white/40 px-2 rounded box-decoration-clone">Joulery.</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-xl mb-10 text-foreground leading-relaxed">
                <span className="bg-white/40 px-2 rounded box-decoration-clone">
                  A collection of handwoven necklaces and bracelets. Crafted purely for the love of the game.
                </span>
              </p>
              <button
                onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-foreground text-white-calm px-8 py-4 uppercase tracking-widest text-sm hover:bg-foreground/90 transition-all shadow-lg pointer-events-auto"
              >
                View Pieces
              </button>
            </FadeIn>
          </section>

          <section id="story" className="scroll-mt-[72px] py-0 px-4 flex items-center justify-center pointer-events-auto relative">
            <div className="absolute inset-0 bg-white-calm z-0 pointer-events-none"></div>
            <div className="max-w-7xl w-full flex flex-col items-center justify-center relative z-20">
              <FadeIn className="max-w-2xl text-center bg-transparent p-8">
                <h2 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent">
                  <span className="bg-white/40 px-2 rounded box-decoration-clone">Our Roots</span>
                </h2>
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-foreground">
                  <span className="bg-white/40 px-2 rounded box-decoration-clone">
                    Every piece is personally handcrafted by a single artisan in the city of Cabanatuan, Nueva Ecija, Philippines. A singular vision of creativity translated into delicate, wearable art.
                  </span>
                </p>
              </FadeIn>
            </div>
          </section>

        </div>
      </motion.div>

      <FadeIn delay={0.1}>
        <ProvenanceMap />
      </FadeIn>

      <section id="shop" className="scroll-mt-[72px] py-24 px-8 bg-background">
        <FadeIn className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-light text-foreground">The Collection</h2>
            <button className="text-sm uppercase tracking-wider border-b border-foreground pb-1 hover:text-pink-accent hover:border-pink-accent transition-all">
              Filter / Sort
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            <FadeIn delay={0.1} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0 bg-white-calm/30 overflow-hidden">
                  <Image 
                    src="/images/products/worn/aquamarine.png" 
                    alt="" 
                    fill 
                    className="object-cover blur-md opacity-30 scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                    <Image 
                      src="/images/products/stills/aquamarine-nobg.png" 
                      alt="Aquamarine Necklace" 
                      fill 
                      className="object-contain scale-75 drop-shadow-xl"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-700 bg-pink-calm">
                  <Image
                    src="/images/products/worn/aquamarine.png"
                    alt="Aquamarine Necklace Worn"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium uppercase tracking-wider text-sm">Aquamarine Silk</h3>
                <span className="font-light">$120</span>
              </div>
              <p className="text-xs text-foreground/70 mt-2 font-light uppercase tracking-widest">Handwoven Blue Aquamarine</p>
            </FadeIn>

            <FadeIn delay={0.2} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0 bg-white-calm/30 overflow-hidden">
                  <Image 
                    src="/images/products/worn/obsidian.png" 
                    alt="" 
                    fill 
                    className="object-cover blur-md opacity-30 scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                    <Image 
                      src="/images/products/stills/obsidian.png" 
                      alt="Obsidian Necklace" 
                      fill 
                      className="object-contain scale-75 drop-shadow-xl"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-700 bg-pink-calm">
                  <Image 
                    src="/images/products/worn/obsidian.png" 
                    alt="Obsidian Necklace Worn" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium uppercase tracking-wider text-sm">Obsidian Heart</h3>
                <span className="font-light">$150</span>
              </div>
              <p className="text-xs text-foreground/70 mt-2 font-light uppercase tracking-widest">Handcrafted Volcanic Glass</p>
            </FadeIn>

            <FadeIn delay={0.3} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0 bg-white-calm/30 overflow-hidden">
                  <Image 
                    src="/images/products/worn/crystalwhite.png" 
                    alt="" 
                    fill 
                    className="object-cover blur-md opacity-30 scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                    <Image 
                      src="/images/products/stills/crystalwhite.png" 
                      alt="Crystal White Necklace" 
                      fill 
                      className="object-contain scale-75 drop-shadow-xl"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-700 bg-pink-calm">
                  <Image 
                    src="/images/products/worn/crystalwhite.png" 
                    alt="Crystal White Necklace Worn" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium uppercase tracking-wider text-sm">Crystal White</h3>
                <span className="font-light">$180</span>
              </div>
              <p className="text-xs text-foreground/70 mt-2 font-light uppercase tracking-widest">Handwoven Clear Quartz</p>
            </FadeIn>

            <FadeIn delay={0.4} className="group cursor-pointer">
              <div className="aspect-[4/5] mb-6 overflow-hidden relative">
                <div className="absolute inset-0 z-10 transition-opacity duration-700 group-hover:opacity-0 bg-white-calm/30 overflow-hidden">
                  <Image 
                    src="/images/products/worn/amethyst.png" 
                    alt="" 
                    fill 
                    className="object-cover blur-md opacity-30 scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                    <Image 
                      src="/images/products/stills/amethyst.png" 
                      alt="Amethyst Necklace" 
                      fill 
                      className="object-contain scale-75 drop-shadow-xl"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-700 bg-pink-calm">
                  <Image 
                    src="/images/products/worn/amethyst.png" 
                    alt="Amethyst Necklace Worn" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground">
                <h3 className="font-medium uppercase tracking-wider text-sm">Amethyst Aura</h3>
                <span className="font-light">$140</span>
              </div>
              <p className="text-xs text-foreground/70 mt-2 font-light uppercase tracking-widest">Handwoven Royal Purple Amethyst</p>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

      <section id="contact" className="scroll-mt-[72px] py-32 px-4 bg-white-calm border-t border-pink-accent/30">
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
              <a href="mailto:hello@joulery.com" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Email">
                <Mail size={22} strokeWidth={1.5} />
              </a>
            </div>
            <p className="text-sm text-foreground/50 font-light leading-relaxed">
              For custom commissions, artisan collaborations, or private collection previews.
            </p>

            <div className="mt-12 pt-12 border-t border-pink-accent/20 w-full">
              <h3 className="text-xs uppercase tracking-[0.2em] mb-4 text-pink-accent font-medium">Support My Craft</h3>
              <p className="text-sm text-foreground/60 font-light leading-relaxed mb-6">
                If you appreciate the solo artistry and want to support this journey, consider making a small donation. Your support keeps the game alive.
              </p>
              <a
                href="#"
                className="inline-block bg-foreground text-white-calm px-8 py-3 uppercase tracking-widest text-[10px] hover:bg-foreground/90 transition-all shadow-sm"
              >
                Support via Stripe
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
