"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Package,
  Palette,
  Zap,
  ShieldCheck,
  ImageIcon,
} from "lucide-react";
import {
  staggerContainer,
  staggerItem,
  viewportConfig,
  defaultTransition,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  className?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: "indigo" | "rose" | "none";
}

const glowMap = {
  indigo:
    "group-hover:border-accent-indigo/30 group-hover:shadow-accent-indigo/10",
  rose:
    "group-hover:border-accent-rose/30 group-hover:shadow-accent-rose/10",
  none: "group-hover:border-border/80",
};

function BentoCard({ className, icon, title, description, accent = "none" }: BentoCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      viewport={viewportConfig}
      transition={defaultTransition}
      className={cn(
        "group relative rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg",
        glowMap[accent],
        className
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted border border-border text-accent-indigo group-hover:bg-accent-indigo/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

const features = [
  {
    title: "AI Model Training",
    description:
      "Upload 10–20 photos and our AI learns your unique features. The more you upload, the more accurate and realistic your generated portraits become.",
    icon: <Sparkles className="w-5 h-5" />,
    accent: "indigo" as const,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "60+ Photo Packs",
    description:
      "From corporate headshots to street-style fashion, choose from dozens of professionally curated packs for every use case.",
    icon: <Package className="w-5 h-5" />,
    accent: "rose" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Custom Styles",
    description:
      "Fine-tune poses, expressions, backgrounds, and lighting to match your personal or brand aesthetic perfectly.",
    icon: <Palette className="w-5 h-5" />,
    accent: "none" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Studio-Grade Quality",
    description:
      "Each image is rendered at high resolution with professional lighting and composition — indistinguishable from a real photoshoot.",
    icon: <ImageIcon className="w-5 h-5" />,
    accent: "indigo" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Instant Generation",
    description:
      "Get your results in minutes, not hours. Our optimized pipeline delivers your complete photo pack faster than ever.",
    icon: <Zap className="w-5 h-5" />,
    accent: "none" as const,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Commercial License",
    description:
      "Use your generated images anywhere — LinkedIn, Instagram, dating profiles, or even commercial brand campaigns. Full rights included.",
    icon: <ShieldCheck className="w-5 h-5" />,
    accent: "rose" as const,
    className: "md:col-span-2 md:row-span-1",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-32 px-4 sm:px-6 lg:px-8 scroll-mt-nav"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={defaultTransition}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white border border-border shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
            <span className="text-xs font-medium text-muted-foreground">
              Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need for{" "}
            <span className="text-gradient-brand">perfect portraits</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
            No expensive studios, no photographers, no scheduling. Just upload
            and let AI do the work.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={viewportConfig}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <BentoCard key={feature.title} {...feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
