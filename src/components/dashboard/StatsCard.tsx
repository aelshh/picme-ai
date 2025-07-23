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
    <div className="grid grid-cols-4 gap-6">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0  ">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{imageCount}</div>
          <p className="text-xs text-muted-foreground">
            Images generated so far{" "}
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0  ">
          <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          <LayersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{modelCount}</div>
          <p className="text-xs text-muted-foreground">Custom model trained</p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0  ">
          <CardTitle className="text-sm font-medium">Image Credits</CardTitle>
          <ZapIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {credits?.image_generation_count || 0}/
            {credits?.max_image_generation_count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Available generation credits
          </p>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0  ">
          <CardTitle className="text-sm font-medium">
            Training Credits
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {credits?.model_training_count || 0}/
            {credits?.max_model_training_count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Available training credits
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
