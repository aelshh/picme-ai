"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tables } from "@/datatypes.types";
import {
  viewportConfig,
  defaultTransition,
} from "@/lib/animations";

type Product = Tables<"products">;
type Prices = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Prices[];
}

interface PricingSectionProps {
  products: ProductWithPrices[];
  popular?: string;
}

export default function PricingSection({
  products,
  popular = "pro",
}: PricingSectionProps) {
  const [billingInterval, setBillingInterval] = useState("month");

  const isYearly = billingInterval === "year";

  return (
    <section
      id="pricing"
      className="w-full py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-nav"
    >
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={defaultTransition}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 bg-white border border-border shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
            <span className="text-xs font-medium text-muted-foreground">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Choose your{" "}
            <span className="text-gradient-brand">perfect plan</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground">
            No hidden fees. Upgrade or cancel anytime.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-muted border border-border p-1">
            <button
              onClick={() => setBillingInterval("month")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all",
                !isYearly
                  ? "bg-white text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all",
                isYearly
                  ? "bg-white text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="ml-1.5 text-[10px] text-accent-indigo font-semibold opacity-80">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {products.map((product) => {
              const price = product.prices.find(
                (p) => p.interval === billingInterval
              );

              const isPopular =
                product.name?.toLowerCase() === popular.toLowerCase();

              const priceString = price
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: price.currency || "USD",
                    minimumFractionDigits: 0,
                  }).format((price.unit_amount || 0) / 100)
                : null;

              const features = Object.values(
                product.metadata ?? {}
              ) as string[];

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={cn(
                    "relative flex flex-col rounded-2xl bg-white p-6 transition-all duration-300",
                    isPopular
                      ? "gradient-border scale-[1.02] shadow-xl shadow-accent-indigo/10"
                      : "border border-border hover:border-border/80 hover:shadow-lg"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-accent-indigo px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mb-8 min-h-[3rem]">
                    {priceString ? (
                      <>
                        <span className="text-4xl font-bold text-foreground">
                          {priceString}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          /{billingInterval}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Contact us
                      </span>
                    )}
                  </div>

                  <Link
                    href="/login?state=signup"
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-95 mb-8",
                      isPopular
                        ? "bg-accent-indigo text-white hover:brightness-110"
                        : "bg-muted text-foreground border border-border hover:bg-white"
                    )}
                  >
                    Get Started
                  </Link>

                  <div className="space-y-3 mt-auto">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      What&apos;s included
                    </p>
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
