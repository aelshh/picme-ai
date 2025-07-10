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

const images = [
  {
    src: "/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg",
    alt: "some alt text",
  },
  {
    src: "/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg",
    alt: "some alt text",
  },
  {
    src: "/hero-images/Confident Woman in Red Outfit.jpeg",
    alt: "some alt text",
  },
  {
    src: "/hero-images/Confident Woman in Urban Setting.jpeg",
    alt: "some alt text",
  },
  {
    src: "/hero-images/Confident Woman in Urban Setting.jpeg",
    alt: "some alt text",
  },
];

const GeneratedImages = () => {
  if (images.length === 0) {
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
                src={img.src}
                alt={img.alt}
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
