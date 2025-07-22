import { getCredits } from "@/app/actions/credit-actions";
import BillingPricing from "@/components/billing/BillingPricing";
import PlanSummary from "@/components/billing/PlanSummary";
import { Tables } from "@/datatypes.types";

import { getProducts, getSubscription, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

import React from "react";

type Product = Tables<"products">;
type Prices = Tables<"prices">;
type Subscription = Tables<"subscriptions">;

interface PriceWithProducts extends Prices {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProducts | null;
}

const BillingPage = async () => {
  const supabase = await createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);
  console.log(subscription);

  if (!user) {
    redirect("/login");
  }

  const { data: credits } = await getCredits();
  return (
    <section className="flex flex-col  item-center justify-center w-full space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
      <p className="text-muted-foreground">
        Manage your subscription and billing information
      </p>

      <PlanSummary
        credits={credits}
        user={user}
        products={products}
        subscription={subscription}
      />
      {subscription.status === "active" && (
        <BillingPricing
          user={user}
          products={products}
          subscription={subscription as SubscriptionWithProduct}
          showInterval={false}
          activeProduct={
            subscription.prices?.products?.name?.toLocaleLowerCase() || "pro"
          }
          className="!p-0 max-w-full"
        />
      )}
    </section>
  );
};

export default BillingPage;
