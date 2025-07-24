"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import { AnimatedGradientText } from "../magicui/animated-gradient-text";

import { cn } from "@/lib/utils";
import { Tables } from "@/datatypes.types";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

type Product = Tables<"products">;

type Prices = Tables<"prices">;

interface ProductWithPrices extends Product {
  prices: Prices[];
}

interface PricingSectionProps {
  products: ProductWithPrices[];
  popular?: string;
}

const PricingSection = ({ products, popular = "pro" }: PricingSectionProps) => {
  const [billingInterval, setBillingIntercval] = useState("month");
  return (
    <section className="flex flex-col items-center justify-center relative bg-accent py-10 sm:py-16 lg:py-20 w-full">
      <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
        <span
          className={cn(
            "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        <AnimatedGradientText className="text-sm font-medium">
          Pricing
        </AnimatedGradientText>
      </div>
      <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mt-3 text-center">
        Choose The Plan That Fits Your Needs
      </h2>
      <p className="text-base text-muted-foreground lg:max-w-[75%] text-center ">
        Choose an affordable plan that is packed with the best features for
        engaging your audience, creating customer loyalty and driving sales.
      </p>
      <div className="flex gap-2 xs:gap-3 items-center justify-center pt-6 xs:pt-10">
        <Label
          htmlFor="billingInterval"
          className="text-xs xs:text-sm sm:text-base"
        >
          Monthly
        </Label>
        <Switch
          id="billingInterval"
          checked={billingInterval === "year"}
          onCheckedChange={(checked) => {
            setBillingIntercval(checked ? "year" : "month");
          }}
        />
        <Label
          htmlFor="billingInterval"
          className="text-xs xs:text-sm sm:text-base"
        >
          Yearly
        </Label>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full px-4 xs:px-8 sm:px-12 lg:px-20 mt-10">
        {products.map((product) => {
          const price = product.prices.find(
            (price) => price.interval === billingInterval
          );
          if (!price) {
            return null;
          }

          const priceString = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency || "",
            minimumFractionDigits: 0,
          }).format((price.unit_amount || 0) / 100);

          return (
            <div
              key={price.id}
              className={cn(
                `w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-[400px] bg-white px-4 pb-8 divide-y divide-border border-border rounded-lg py-5 border shadow-sm`,
                product.name?.toLocaleLowerCase() ===
                  popular.toLocaleLowerCase()
                  ? "border-primary scale-105 bg-background drop-shadow-md"
                  : "border-border"
              )}
            >
              <div>
                <h2 className="text-lg xs:text-xl font-semibold flex items-center justify-between">
                  {product.name}{" "}
                  {product.name?.toLocaleLowerCase() ===
                    popular.toLocaleLowerCase() && (
                    <Badge className="rounded-full h-fit">Most Popular</Badge>
                  )}
                </h2>
                <p className="text-muted-foreground text-xs xs:text-sm mt-3">
                  {product.description}
                </p>
                <h1 className="mb-8 mt-6">
                  <span className="text-2xl xs:text-3xl font-bold">
                    {priceString}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingInterval}
                  </span>
                </h1>
                <Link href="/login?state=signup">
                  <Button
                    className={cn(`w-full mb-5`)}
                    variant={product.name === "Pro" ? "default" : "secondary"}
                  >
                    Subscribe
                  </Button>
                </Link>
              </div>
              <div className="mt-5 space-y-3">
                <h3 className="text-xs font-medium mb-5">
                  WHAT&apos;S INCLUDED
                </h3>
                {Object.values(product.metadata as object).map(
                  (value, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Check className="w-4 h-4" />
                      <li className="list-none">{value}</li>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
