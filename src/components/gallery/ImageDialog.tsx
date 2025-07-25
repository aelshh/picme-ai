import { Tables } from "@/datatypes.types";
import React from "react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Badge } from "../ui/badge";

import DeleteImage from "./DeleteImage";

type ImageDialogProps = {
  image: { url: string | undefined } & Tables<"generated_images">;
  onClose: () => void;
};

const ImageDialog = ({ image, onClose }: ImageDialogProps) => {
  const handleDownload = () => {
    fetch(image.url || "")
      .then((reponse) => reponse.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `generated-image-${Date.now()}.${image.output_format}`
        );

        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
      })
      .catch((error) => console.log(error));
  };
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="max-w-full sm:max-w-5xl w-full">
        <SheetHeader>
          <SheetTitle className="text-2xl w-full">Image Details</SheetTitle>
          <ScrollArea className="h-screen  ">
            <div className="relative w-fit  mx-auto h-fit  ">
              <Image
                src={image.url || " "}
                alt={image.prompt || " "}
                height={image.height || 0}
                width={image.width || 0}
                className="w-full   h-auto  flex mb-3 rounded"
              />
              <div className="flex  gap-4 absolute bottom-4 right-4">
                <Button className="w-fit" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <DeleteImage
                  imageId={image.id.toString()}
                  onDelete={onClose}
                  className="w-fit"
                  imageName={image.image_name || " "}
                />
              </div>
            </div>
            <hr className="w-full inline-block border-primary/30 mb-2" />
            <p className="text-primary/90 w-full flex flex-col">
              <span className="text-primary text-xl font-semibold">
                {" "}
                Prompt
              </span>
              {image.prompt}
            </p>
            <hr className="w-full inline-block border-primary/30 my-3" />
            <div className="flex flex-wrap max-w-full gap-3 mb-32">
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm  font-normal"
              >
                <span className="text-primary max-w-40 uppercase mr-2 font-semibold">
                  Model ID:
                </span>
                {image.model?.split(":")[0]}
              </Badge>

              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Aspect Ratio:
                </span>
                {image.aspect_ratio}
              </Badge>
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Dimensions:
                </span>
                {image.width} x {image.height}
              </Badge>
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Guidance:
                </span>
                {image.guidance}
              </Badge>
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Inference Steps:
                </span>
                {image.num_inference_steps}
              </Badge>
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Output Format:
                </span>
                {image.output_format}
              </Badge>
              <Badge
                variant={"secondary"}
                className="rounded-full border border-primary/30 px-4 py-2 text-xs sm:text-sm font-normal"
              >
                <span className="text-primary uppercase mr-2 font-semibold">
                  Created At:
                </span>
                {new Date(image.created_at).toLocaleDateString()}
              </Badge>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ImageDialog;
