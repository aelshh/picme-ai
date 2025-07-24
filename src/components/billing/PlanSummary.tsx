import { Tables } from "@/datatypes.types";
import { User } from "@supabase/supabase-js";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

import PriceSheet from "./PriceSheet";
import { format } from "date-fns";

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
  credits: Tables<"credits"> | null;
}

const PlanSummary = ({
  credits,
  user,
  products,
  subscription,
}: PlanSummaryProps) => {
  if (!credits || !subscription || subscription.status !== "active") {
    return (
      <Card className="w-3/4">
        <CardHeader className=" flex items-center ">
          <span className="font-semibold">Plan Summary</span>{" "}
          <Badge className="bg-muted-foreground/20 text-black rounded-full ">
            No Plan
          </Badge>
        </CardHeader>
        <CardContent className="w-3/5">
          <div>
            <div className=" flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground ">
                Image generation credits left
              </span>
              <span className="font-medium text-black/70">0 remaining</span>
            </div>
            <Progress value={0.2} max={100} />
          </div>
          <div className="mt-5">
            <div className=" flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground ">
                Model generation credits left
              </span>
              <span className="font-medium text-black/70">0 remaining</span>
            </div>
            <Progress value={0.2} max={100} />
          </div>

          <p className="mt-4 text-accent-foreground">
            Please upgrate to a plan to continue using the app.
          </p>
        </CardContent>
        <CardFooter className=" border-t-1 border-border  px-4 py-4 pb-0">
          <span className="ml-auto flex flex-row">
            <PriceSheet
              user={user}
              products={products}
              subscription={subscription}
            />
          </span>
        </CardFooter>
      </Card>
    );
  }
  console.log(subscription);
  const {
    products: SubscriptionProduct,
    unit_amount,
    currency,
  } = subscription.prices!;

  const priceString = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "",
    minimumFractionDigits: 0,
  }).format((unit_amount || 0) / 100);

  const imageGenCount = credits.image_generation_count ?? 0;
  const modelTrainingCount = credits.model_training_count ?? 0;
  const maxIamgeGenCount = credits.max_image_generation_count ?? 0;
  const maxModelTrainCount = credits.max_model_training_count ?? 0;

  return (
    <Card className="w-full xl:max-w-5/6">
      <CardHeader className=" flex items-center ">
        <span className="font-semibold">Plan Summary</span>{" "}
        <Badge className="bg-muted-foreground/20 text-black rounded-full ">
          {SubscriptionProduct!.name} Plan
        </Badge>
      </CardHeader>
      <CardContent className="w-full">
        <div className="xl:w-3/5 w-full">
          <div className=" flex items-center justify-between text-sm mb-1">
            <span className="font-semibold text-base">
              {imageGenCount}/{maxIamgeGenCount}
            </span>
            <span className="text-muted-foreground ">
              Image generation credits
            </span>
          </div>
          <Progress
            value={(imageGenCount / maxIamgeGenCount) * 100}
            max={100}
          />
        </div>
        <div className="mt-5 flex flex-col xl:flex-row gap-5 xl:gap-0 justify-between">
          <div className="xl:w-3/5 w-full">
            <div className=" flex items-center justify-between text-sm mb-1">
              <span className="font-semibold text-base">
                {modelTrainingCount}/{maxModelTrainCount}
              </span>
              <span className="text-muted-foreground ">
                Model training credits
              </span>
            </div>
            <Progress
              value={(modelTrainingCount / maxModelTrainCount) * 100}
              max={100}
            />
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-black/60 font-medium">
                Price/Month
              </span>
              <span className="font-semibold text-sm">{priceString}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-black/60 font-medium">
                Included Credits
              </span>
              <span className="font-semibold text-sm">0 credits</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-black/60 font-medium">
                Renewal Date
              </span>
              <span className="font-semibold text-sm">
                {format(new Date(subscription.current_period_end), "PP")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanSummary;
