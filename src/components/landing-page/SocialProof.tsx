"use client";

import { motion } from "framer-motion";
import { Marquee } from "@/components/magicui/marquee";
import { viewportConfig, defaultTransition } from "@/lib/animations";

const logos = [
  "TechCrunch",
  "Forbes",
  "The Verge",
  "Wired",
  "Product Hunt",
  "VentureBeat",
  "Business Insider",
  "Fast Company",
  "CNET",
  "Engadget",
  "Mashable",
  "ZDNet",
];

export default function SocialProof() {
  return (
    <section className="w-full py-16 border-y border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={defaultTransition}
        className="mb-6 text-center"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by teams worldwide
        </p>
      </motion.div>
      <div className="relative">
        <Marquee className="[--duration:40s] [--gap:4rem]">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-sm font-semibold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors select-none"
            >
              {logo}
            </span>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
