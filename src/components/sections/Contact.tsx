"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { SITE_CONFIG } from "@/lib/constants";

const FacebookIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const InstagramIcon = ({ size = 22, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const lastSent = localStorage.getItem('last_contact_sent');
    if (lastSent) {
      const remaining = Math.ceil((120000 - (Date.now() - parseInt(lastSent))) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const copyEmail = () => {
    navigator.clipboard.writeText(SITE_CONFIG.links.email as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cooldown > 0) return;

    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();

        // Set 2-minute cooldown
        localStorage.setItem('last_contact_sent', Date.now().toString());
        setCooldown(120);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="scroll-mt-[72px] py-32 px-4 bg-white-calm border-t border-pink-accent/30">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
        <FadeIn className="flex-1">
          <h2 className="text-3xl font-light mb-8 text-foreground">Ask Us</h2>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-pink-calm/30 p-8 rounded-2xl border border-pink-accent/20 text-center"
              >
                <h3 className="text-lg font-light text-foreground mb-2">Message Sent</h3>
                <p className="text-sm text-foreground/60 font-light">Thank you for reaching out. We'll get back to you soon.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-xs uppercase tracking-widest text-pink-accent font-bold"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground placeholder:text-foreground/50"
                    required
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground placeholder:text-foreground/50"
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  rows={5}
                  className="px-6 py-4 bg-pink-calm/30 border-none outline-none focus:ring-1 focus:ring-pink-accent w-full font-light text-foreground resize-none placeholder:text-foreground/50"
                  required
                />
                {/* Honeypot field for spam protection - invisible to users */}
                <div className="hidden" aria-hidden="true">
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting' || cooldown > 0}
                  className="w-full bg-pink-accent text-foreground py-4 text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-pink-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === 'submitting' ? 'Sending...' : (cooldown > 0 ? `Wait ${cooldown}s` : 'Send Message')}
                </button>
                {status === 'error' && (
                  <p className="text-xs text-red-400 mt-2">Something went wrong. Please try again.</p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </FadeIn>

        <FadeIn delay={0.2} className="w-full md:w-72 flex flex-col justify-center items-center md:items-start text-center md:text-left border-t md:border-t-0 md:border-l border-pink-accent/20 pt-12 md:pt-0 md:pl-12">
          <h3 className="text-xs uppercase tracking-[0.2em] mb-6 text-pink-accent font-medium">Connect With Us</h3>
          <div className="flex gap-8 mb-8">
            <a href={SITE_CONFIG.links.facebook} className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Facebook">
              <FacebookIcon size={22} strokeWidth={1.5} />
            </a>
            <a href={SITE_CONFIG.links.instagram} className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="Instagram">
              <InstagramIcon size={22} strokeWidth={1.5} />
            </a>
            <a href={SITE_CONFIG.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-pink-accent transition-colors" aria-label="WhatsApp">
              <MessageCircle size={22} strokeWidth={1.5} />
            </a>
            <div className="relative">
              <button
                onClick={copyEmail}
                className="text-foreground/60 hover:text-pink-accent transition-colors cursor-pointer"
                aria-label="Copy Email"
              >
                <Mail size={22} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {isCopied && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 10, x: "-50%" }}
                    className="absolute -top-10 left-1/2 bg-foreground text-white-calm text-[10px] px-3 py-1.5 rounded uppercase tracking-widest font-bold whitespace-nowrap shadow-xl z-50"
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <p className="text-sm text-foreground/50 font-light leading-relaxed">
            For special orders or to see new things early.
          </p>

          <div className="mt-12 pt-12 border-t border-pink-accent/20 w-full">
            <h3 className="text-xs uppercase tracking-[0.2em] mb-4 text-pink-accent font-medium">Help Us</h3>
            <p className="text-sm text-foreground/60 font-light leading-relaxed mb-6">
              If you like my art and want to help, please send a small gift. Your help keeps me going.
            </p>
            <Link
              href="/support"
              className="inline-block bg-pink-accent text-foreground px-8 py-3 uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-pink-accent/20 transition-all shadow-sm cursor-pointer"
            >
              Support Me
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
