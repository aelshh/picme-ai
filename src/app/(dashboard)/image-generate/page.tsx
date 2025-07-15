import { fetchModels } from "@/app/actions/model-actions";
import Configuration from "@/components/image-generation/Configuration";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

interface SearchParams {
  model_id: string;
}

const GenerateImage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const modelId = (await searchParams).model_id;
  const { data: userModels } = await fetchModels();
  return (
    <section className="container grid flex-1   w-full grid-cols-3 mx-auto overflow-hidden">
      <Configuration modelId={modelId} models={userModels} />

      <div className="col-span-2 p-4 rounded-xl h-full flex items-center justify-center ">
        <GeneratedImages />
      </div>
    </section>
  );
};

export default GenerateImage;
