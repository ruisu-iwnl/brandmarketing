"use client";

// Shared footer component for Mutya
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";

const FacebookIcon = ({ size = 16, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ size = 16, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function Footer() {
  return (
    <footer className="py-8 px-8 bg-white-calm border-t border-pink-calm flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-foreground/50">
      <div>&copy; 2026 Mutya Jewelry. All rights reserved.</div>
      <div className="flex gap-6 mt-4 md:mt-0 items-center">
        <a href="#" className="hover:text-foreground transition-colors" aria-label="Facebook">
          <FacebookIcon size={16} strokeWidth={1.5} />
        </a>
        <a href="#" className="hover:text-foreground transition-colors" aria-label="Instagram">
          <InstagramIcon size={16} strokeWidth={1.5} />
        </a>
        <a href="#" className="hover:text-foreground transition-colors" aria-label="WhatsApp">
          <MessageCircle size={16} strokeWidth={1.5} />
        </a>
        <a href="mailto:hello@mutya.com" className="hover:text-foreground transition-colors" aria-label="Email">
          <Mail size={16} strokeWidth={1.5} />
        </a>
        <Link href="/terms" className="hover:text-foreground transition-colors ml-4">Terms</Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
      </div>
    </footer>
  );
}
