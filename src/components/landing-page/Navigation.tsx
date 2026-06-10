"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useActiveSection } from "@/hooks/use-active-section";
import { smoothScrollTo } from "@/hooks/use-smooth-scroll";

const navLinks = [
  { href: "features", label: "Features" },
  { href: "pricing", label: "Pricing" },
  { href: "faqs", label: "FAQ" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 100], [0.02, 0.12]);

  function handleNavClick(id: string) {
    smoothScrollTo(id);
    setMobileOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
    >
      <motion.nav
        style={{ boxShadow: useTransform(shadowOpacity, (v) => `0 4px 24px rgba(0,0,0,${v})`) }}
        className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-border animate-float"
      >
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "text-accent-indigo"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-0 rounded-lg bg-accent-indigo/[0.08]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login?state=signup"
            className="relative inline-flex h-9 items-center justify-center rounded-full bg-accent-indigo px-5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95 animate-pulse-glow"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-2 p-4 rounded-xl bg-white/90 backdrop-blur-xl border border-border"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm text-left py-2 px-3 rounded-lg transition-colors ${
                  activeSection === link.href
                    ? "text-accent-indigo bg-accent-indigo/[0.08] font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
            <hr className="border-border" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground py-2 px-3"
            >
              Sign In
            </Link>
            <Link
              href="/login?state=signup"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-9 items-center justify-center rounded-full bg-accent-indigo px-5 text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
