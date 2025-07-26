"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import { cn } from "@/lib/utils";
import { Tables } from "@/datatypes.types";
import { Button } from "../ui/button";

import { Badge } from "../ui/badge";
import { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { checkoutWithStripe, createStripePortal } from "@/lib/stripe/server";
import { getErrorRedirect } from "@/lib/helpers";
import { getStripe } from "@/lib/stripe/client";
import { toast } from "sonner";

type Product = Tables<"products">;
type Prices = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface ProductWithPrices extends Product {
  prices: Prices[];
}

interface PriceWithProducts extends Prices {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProducts | null;
}

interface BillingPricingProps {
  user: User;
  products: ProductWithPrices[] | null;
  popular?: string;
  className?: string;
  activeProduct?: string;
  subscription: SubscriptionWithProduct | null;
  showInterval?: boolean;
}

const renderPricingButton = ({
  product,
  subscription,
  price,
  user,
  popular,
  handleStripePortalRequest,
  handleStripeCheckout,
}: {
  user: User;
  price: Prices;
  product: ProductWithPrices;
  popular: string;
  subscription: SubscriptionWithProduct | null;
  handleStripePortalRequest: () => Promise<void>;
  handleStripeCheckout: (price: Prices) => Promise<void>;
}) => {
  if (
    user &&
    subscription &&
    subscription.prices?.products?.name?.toLocaleLowerCase() ===
      product.name?.toLowerCase()
  ) {
    return (
      <Button
        className="w-full font-semibold"
        onClick={handleStripePortalRequest}
      >
        Mangae Subscription
      </Button>
    );
  }

  if (user && subscription) {
    return (
      <Button
        variant={"secondary"}
        className="w-full"
        onClick={handleStripePortalRequest}
      >
        Switch Plan
      </Button>
    );
  }

  if (user && !subscription) {
    return (
      <Button
        variant={
          product.name?.toLocaleLowerCase() === popular.toLocaleLowerCase()
            ? "default"
            : "secondary"
        }
        className="w-full"
        onClick={async () => await handleStripeCheckout(price)}
      >
        {" "}
        Subscribe
      </Button>
    );
  }

  return (
    <Button
      variant={
        product.name?.toLocaleLowerCase() === popular.toLocaleLowerCase()
          ? "default"
          : "secondary"
      }
      className="w-full"
      onClick={async () => await handleStripeCheckout(price)}
    >
      Subscribe
    </Button>
  );
};

const BillingPricing = ({
  products,
  subscription,
  user,
  className,
  activeProduct,
  showInterval = true,
  popular,
}: BillingPricingProps) => {
  const router = useRouter();
  const currentPath = usePathname();

  const [billingInterval, setBillingIntercval] = useState("month");
  const handleStripeCheckout = async (price: Prices) => {
    if (!user) {
      router.push("/login");
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      return router.push(errorRedirect);
    }
    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          currentPath,
          "An unexpected error occured",
          "Please try again later or contact us."
        )
      );
    }

    const stripe = await getStripe();

    stripe?.redirectToCheckout({ sessionId });
  };
  const handleStripePortalRequest = async () => {
    toast.info("Redirecting to stripe portal...");
    const redirectUrl = await createStripePortal(currentPath);
    return router.push(redirectUrl);
  };
  return (
    <section className={cn(`flex flex-col  relative py-2  w-full `, className)}>
      {showInterval && (
        <div>
          <h1
            className="font-semibold
          text-lg  pb-1 mt-3"
          >
            Change subscription plan
          </h1>
          <p className="text-muted-foreground/70  text-sm font-medium ">
            Choose a plan that fits your needs and budget to continue using our
            services
          </p>
        </div>
      )}
      {showInterval && (
        <div className="flex gap-3 items-center  w-30 mx-auto justify-between pt-15">
          <Label htmlFor="billingInterval"> Monthly</Label>
          <Switch
            id="billingInterval"
            checked={billingInterval === "year"}
            onCheckedChange={(checked) => {
              setBillingIntercval(checked ? "year" : "month");
            }}
          />
          <Label htmlFor="billingInterval"> Yearly</Label>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full px-0 mt-15">
        {products?.map((product) => {
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
                `bg-white px-4 pb-8 w-full border-border rounded-lg py-5 border`,
                product.name?.toLocaleLowerCase() ===
                  activeProduct?.toLocaleLowerCase()
                  ? "border-primary bg-background drop-shadown-md"
                  : "border-border"
              )}
            >
              <h2 className="text-xl font-semibold flex items-center justify-between">
                {product.name}{" "}
                {product.name?.toLocaleLowerCase() ===
                  activeProduct?.toLocaleLowerCase() && (
                  <Badge className="rounded-full h-fit">Selected</Badge>
                )}
                {product.name?.toLocaleLowerCase() ===
                  popular?.toLocaleLowerCase() && (
                  <Badge className="rounded-full h-fit">Most Popular</Badge>
                )}
              </h2>
              <p className="text-muted-foreground text-sm mt-3">
                {product.description}
              </p>
              <h1 className="mb-10 mt-6">
                <span className="text-3xl font-bold">{priceString}</span>
                <span className="text-muted-foreground">
                  /{billingInterval}
                </span>
              </h1>
              {renderPricingButton({
                product,
                subscription,
                user,
                price,
                popular: popular ?? "",
                handleStripeCheckout,
                handleStripePortalRequest,
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BillingPricing;
