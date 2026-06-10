"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import dashboardImg from "@/public/dashboard-img.png";

function MagneticButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  function handleMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isPrimary = variant === "primary";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all",
          isPrimary
            ? "bg-accent-indigo text-white hover:brightness-110 shadow-lg shadow-accent-indigo/20"
            : "border border-border text-foreground hover:bg-muted"
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow-rose pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 bg-white border border-border shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent-indigo mr-2" />
          <span className="text-xs font-medium text-muted-foreground">
            New — Flux Pro Model
          </span>
          <ChevronRight className="ml-1 w-3.5 h-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="max-w-4xl px-4 text-center"
      >
        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none">
          <span className="text-gradient-brand">
            Your AI Portrait
          </span>
          <br />
          <span className="text-foreground">Studio</span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-6 max-w-2xl px-4 text-center text-base sm:text-lg text-muted-foreground"
      >
        Train a custom AI model with your photos and generate studio-quality
        portraits in hundreds of styles — from LinkedIn headshots to creative
        editorials.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4"
      >
        <MagneticButton href="/login?state=signup">
          Generate Your First Model
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
        <MagneticButton href="#demo" variant="secondary">
          See How It Works
        </MagneticButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-16 w-full max-w-5xl px-4"
      >
        <div className="relative rounded-2xl border border-border bg-white overflow-hidden shadow-xl shadow-black/[0.02]">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-indigo/20 via-accent-rose/20 to-accent-indigo/20 rounded-2xl blur-xl opacity-50" />
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src={dashboardImg}
              alt="Picme AI Dashboard Preview"
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft" />
              <span className="text-xs text-muted-foreground font-mono">
                Model ready — 12 portraits generated
              </span>
            </div>
            <span className="text-xs text-accent-indigo font-mono font-medium">
              ● Online
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
