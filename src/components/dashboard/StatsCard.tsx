import { Database } from "@/datatypes.types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ImageIcon, LayersIcon, Wallet, ZapIcon } from "lucide-react";

interface StatsCardProp {
  imageCount: number;
  modelCount: number;
  credits: Database["public"]["Tables"]["credits"]["Row"] | null;
}

const StatsCard = ({ imageCount, modelCount, credits }: StatsCardProp) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
      <Card className="gap-2 w-full min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className=" font-medium">Total Images</CardTitle>
          <ImageIcon className="h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl xs:text-3xl font-bold w-full break-words truncate text-left ">
            {imageCount}
          </div>
          <p className="text-sm text-muted-foreground">
            Images generated so far{" "}
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2 w-full min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className=" font-medium">Total Models</CardTitle>
          <LayersIcon className="h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl xs:text-3xl font-bold w-full break-words truncate text-left ">
            {modelCount}
          </div>
          <p className="text-sm text-muted-foreground">Custom model trained</p>
        </CardContent>
      </Card>
      <Card className="gap-2 w-full min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium">Image Credits</CardTitle>
          <ZapIcon className="h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl xs:text-3xl font-bold w-full break-words truncate text-left">
            {credits?.image_generation_count || 0}/
            {credits?.max_image_generation_count || 0}
          </div>
          <p className="text-sm text-muted-foreground">
            Available generation credits
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2 w-full min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="font-medium">Training Credits</CardTitle>
          <Wallet className="h-4 w-4 xs:h-5 xs:w-5 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl xs:text-3xl font-bold w-full break-words truncate text-left">
            {credits?.model_training_count || 0}/
            {credits?.max_model_training_count || 0}
          </div>
          <p className="text-sm text-muted-foreground">
            Available training credits
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
