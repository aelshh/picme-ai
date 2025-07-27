import { Tables } from "@/datatypes.types";
import { User } from "@supabase/supabase-js";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import BillingPricing from "./BillingPricing";
import { ScrollArea } from "../ui/scroll-area";

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

interface PlanSummaryProps {
  user: User | null;
  products: ProductWithPrices[] | null;
  subscription: SubscriptionWithProduct | null;
}

const PriceSheet = ({ user, products, subscription }: PlanSummaryProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"}>Upgrade</Button>
      </SheetTrigger>
      <SheetContent className="md:max-w-6xl max-w-xs lg:max-w-7xl sm:max-w-sm">
        <SheetHeader>
          <ScrollArea className="h-screen">
            <BillingPricing
              popular="pro"
              user={user!}
              products={products || []}
              subscription={subscription}
            />
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default PriceSheet;
