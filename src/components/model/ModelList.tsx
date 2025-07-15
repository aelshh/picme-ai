"use client";

import { Database } from "@/datatypes.types";
import React, { useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { PostgrestError } from "@supabase/supabase-js";
import { formatDistance } from "date-fns";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
  User2,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteModel } from "@/app/actions/model-actions";

type ModelType = {
  error: PostgrestError | null;
  success: boolean;
  data: Database["public"]["Tables"]["models"]["Row"][] | null;
};

interface ModelListProps {
  models: ModelType;
}

const ModelList = ({ models }: ModelListProps) => {
  const toastId = useId();
  const { data } = models;

  const handleDelte = async (
    id: number,
    model_name: string,
    model_version: string | null
  ) => {
    toast.loading("Deleting the model...", { id: toastId });
    const { error, success } = await deleteModel(id, model_name, model_version);
    if (error) {
      toast.error(error, { id: toastId });
    }
    if (success) {
      toast.success("Deteled the model successfully", { id: toastId });
    }
  };

  if (data?.length === 0) {
    return (
      <Card className="flex h-[450px] w-full flex-cols items-center justify-center text-center">
        <CardHeader className="w-full">
          <CardTitle>No Models Found</CardTitle>
          <CardDescription>
            You have not trained any models yet. Start by creating a model.
          </CardDescription>
          <Link href="/model-training" className="inline-block pt-2">
            <Button className="w-fit">Create Model</Button>
          </Link>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div className="grid gap-6 grid-cols-3">
      {data?.map((model) => (
        <Card key={model.id} className="relative flex flex-col overflow-hidden">
          <CardHeader className="w-full">
            <div className="flex items-center justify-between">
              <CardTitle>{model.model_name}</CardTitle>
              <div className="flex items-center gap-2 justify-center">
                {model.training_status === "succeeded" ? (
                  <div className="flex item-center gap-1 text-sm text-green-500">
                    <CheckCircle2 className="w-4 h-4 " />
                    <span className="capitalize">Ready</span>
                  </div>
                ) : model.training_status === "failed" ||
                  model.training_status === "canceled" ? (
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <XCircle className="w-4 h-4" />
                    <span className="capitalize"> {model.training_status}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="capitalize"> Training</span>
                  </div>
                )}
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      size="icon"
                      variant={"ghost"}
                      className="text-destructive/90 hover:text-destructive w-8 h-8"
                    >
                      <Trash2 className=" w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Modal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this modal? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => {
                          handleDelte(
                            model.id,
                            model.model_id || " ",
                            model.version || null
                          );
                        }}
                      >
                        {" "}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardDescription>
              Created{" "}
              {formatDistance(new Date(model.created_at), new Date(), {
                addSuffix: true,
              })}
            </CardDescription>
            <CardContent className="flex-1 mt-3 relative p-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium  ">
                        Training Duration
                      </span>
                    </div>
                    <p className=" mt-1  text-sm">
                      {Math.round(Number(model.training_time) / 60) || NaN} mins
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User2 className="w-4 h-4" />
                      <span className="text-xs font-medium  ">Gender</span>
                    </div>
                    <p className=" mt-1 font-normal text-sm">{model.gender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="pt-4">
              <Link
                className="flex w-full group "
                href={
                  model.training_status === "succeeded"
                    ? `/image-generate?model_id=${model.model_id}:${model.version}`
                    : "#"
                }
              >
                <Button
                  className="w-full group-hover:bg-primary/90 cursor-pointer"
                  disabled={model.training_status !== "succeeded"}
                >
                  Generate Imgaes <ArrowRight className="w-2 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ModelList;
