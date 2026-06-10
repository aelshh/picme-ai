"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  viewportConfig,
  defaultTransition,
} from "@/lib/animations";

export default function CtaSection() {
  return (
    <section className="w-full py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow-rose pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportConfig}
        transition={defaultTransition}
        className="max-w-3xl mx-auto text-center relative"
      >
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white border border-border shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
          <span className="text-xs font-medium text-muted-foreground">
            Get Started Free
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
          Ready to transform your{" "}
          <span className="text-gradient-brand">photos</span>?
        </h2>

        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-8">
          Join thousands of creators using Picme AI to generate stunning,
          lifelike portraits in minutes.
        </p>

        <Link
          href="/login?state=signup"
          className="inline-flex items-center gap-2 rounded-full bg-accent-indigo px-8 py-4 text-base font-medium text-white hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-accent-indigo/20"
        >
          Create Your First AI Model
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
