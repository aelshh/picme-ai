import { fetchModels } from "@/app/actions/model-actions";
import ModelList from "@/components/model/ModelList";
import React from "react";

const MyModels = async () => {
  const data = await fetchModels();
  return (
    <section className="container   mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Models</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your trainded models
        </p>
      </div>
      <ModelList models={data} />
    </section>
  );
};

export default MyModels;
