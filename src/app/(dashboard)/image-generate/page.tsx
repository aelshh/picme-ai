import Configuration from "@/components/image-generation/Configuration";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const GenerateImage = () => {
  return (
    <section className="container grid flex-1   w-full grid-cols-3 mx-auto overflow-hidden">
      <Configuration />

      <div className="col-span-2 p-4 rounded-xl h-full flex items-center justify-center ">
        <GeneratedImages />
      </div>
    </section>
  );
};

export default GenerateImage;
