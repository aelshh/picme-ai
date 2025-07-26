import { Tables } from "@/datatypes.types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface RecentImagesProps {
  images: Array<Tables<"generated_images"> & { url: string | undefined }>;
}

const RecentImages = ({ images }: RecentImagesProps) => {
  const filteredImages = images.filter((img) => !!img.url);
  if (filteredImages.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle className="text-base">Recent Generations</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <p className="text-muted-foreground mt-16">
            No images generated yet!
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Generations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Carousel className="w-full ">
          <CarouselContent>
            {filteredImages.map((image) => (
              <CarouselItem
                key={image.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="space-y-2">
                  <div
                    className={cn(
                      `relative overflow-hidden rounded-lg`,
                      image.height && image.width
                        ? `aspect-[${image.width}/${image.height}]`
                        : `aspect-square`
                    )}
                  >
                    <Image
                      src={image.url!}
                      alt={image.prompt || ""}
                      width={image.width || 100}
                      height={image.height || 100}
                      className="object-cover"
                    />
                    <div className="mt-1">
                      <p className=" text-muted-foreground line-clamp-2">
                        {image.prompt?.startsWith(`photo of a okhw man`)
                          ? image.prompt.replace(/^photo of a okhw man\s*/i, "")
                          : image.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 cursor-pointer" />
          <CarouselNext className="right-2 cursor-pointer" />
        </Carousel>
        <div className="flex justify-end">
          <Link href={"/gallery"}>
            <Button
              variant={"ghost"}
              size="sm"
              className="text-base cursor-pointer"
            >
              {" "}
              View gallery <ArrowRight className="ml-2 w-4 h-4  " />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentImages;
