"use client";
import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useGenerateStore from "@/store/useGenerateStore";

const GeneratedImages = () => {
  const images = useGenerateStore((state) => state.images);
  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square w-full max-w-xl  bg-muted">
        <CardContent className="flex items-center justify-center aspect-square p-6">
          <span className="2xl">There are no generated images</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image
                fill
                src={img.url}
                alt={"AI generated Images"}
                className="w-full h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default GeneratedImages;
