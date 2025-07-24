import { getImages } from "@/app/actions/image-actions";
import GalleryComponent from "@/components/gallery/GalleryComponent";
import React from "react";

const MyImages = async () => {
  const { data: images } = await getImages();
  return (
    <section className="container mx-auto  pt-10 ">
      <h1 className="text-3xl font-semibold mb-2 ">My Images</h1>
      <p className="text-muted-foreground mb-6">
        Here you can see all the images you have generated. Click on an image to
        view the detials.
      </p>
      <GalleryComponent images={images || []} />
    </section>
  );
};

export default MyImages;
