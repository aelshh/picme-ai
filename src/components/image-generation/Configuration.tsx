"use client";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { Info } from "lucide-react";
import useGenerateStore from "@/store/useGenerateStore";
import { useEffect } from "react";
import { Tables } from "@/datatypes.types";

export const imageGenerationSchema = z.object({
  model: z.string({
    required_error: "Model is required!",
  }),
  prompt: z.string({
    required_error: "Prompt is required!",
  }),
  guidance: z.number({
    required_error: "Guidance is required!",
  }),
  num_outputs: z
    .number()
    .min(1, "Number of outputs should be atleast 1")
    .max(4, "Number of outputs must be less than 4."),
  aspect_ratio: z.string({
    required_error: "Aspect ratio is required",
  }),
  output_format: z.string({ required_error: "Output format is required" }),
  output_quality: z
    .number()
    .min(1, "Output quality should be ateast 1.")
    .max(100, "Output qulaity should be less or equal to 100."),
  num_inference_steps: z
    .number()
    .min(1, "Number of inference steps must be atleast 1")
    .max(50, "Number of inference steps must be less than 50"),
});

interface ConfigurationProps {
  models: Tables<"models">[] | null;
  modelId: string;
}

const Configuration = ({ models, modelId }: ConfigurationProps) => {
  const form = useForm<z.infer<typeof imageGenerationSchema>>({
    resolver: zodResolver(imageGenerationSchema),
    defaultValues: {
      model: modelId ? `adarsh-9919/${modelId}` : "black-forest-labs/flux-dev",
      prompt: "",
      guidance: 3,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "model") {
        let newSteps;
        if (value.model == "black-forest-labs/flux-schnell") {
          newSteps = 4;
        } else {
          newSteps = 28;
        }

        if (newSteps !== undefined) {
          form.setValue("num_inference_steps", newSteps);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const generateImage = useGenerateStore((state) => state.generateImage);

  async function onSubmit(values: z.infer<typeof imageGenerationSchema>) {
    const newValues = {
      ...values,
      prompt: values.model.startsWith("adarsh-9919")
        ? (() => {
            const modelId = values.model
              .replace("adarsh-9919/", "")
              .split(":")[0];

            const selectedModel = models?.find(
              (model) => model.model_id == modelId
            );
            return `photo of a ${selectedModel?.trigger_word} ${selectedModel?.gender} ${values.prompt}`;
          })()
        : `${values.prompt}`,
    };

    await generateImage(newValues);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <fieldset className="border grid gap-9 bg-background p-4 rounded-lg w-full">
            <legend className="text-sm -ml-1 font-medium px-2">Settings</legend>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 flex gap-2 items-center">
                    Model
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3 " />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>You can select any model from the dropdoown menu.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Flux Dev
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        Flux Schnell
                      </SelectItem>
                      {models &&
                        models.map(
                          (model) =>
                            model.training_status === "succeeded" && (
                              <SelectItem
                                key={model.id}
                                value={`adarsh-9919/${model.model_id}:${model.version}`}
                              >
                                {model.model_name}
                              </SelectItem>
                            )
                        )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex  gap-4 items-center justify-between">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel className="text-gray-600 flex gap-2 items-center">
                      Aspect Ratio
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-3 " />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Aspect Ratio for the generated image.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1:1">1:1</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="21:9">21:9</SelectItem>
                        <SelectItem value="3:2">3:2</SelectItem>
                        <SelectItem value="2:3">2:3</SelectItem>
                        <SelectItem value="4:5">4:5</SelectItem>
                        <SelectItem value="5:4">5:4</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                        <SelectItem value="9:21">9:21</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-600 flex gap-2 items-center">
                      Number of Outputs
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="size-3 " />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total number of output images to generate.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        max={4}
                        min={1}
                        {...field}
                        onChange={(event) => {
                          field.onChange(+event.target.value);
                        }}
                      ></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="guidance"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-600 justify-between flex gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <span>Guidance</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-3 " />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Prompt guidance for generated image.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div>{field.value}</div>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={10}
                        step={0.5}
                        onValueChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="num_inference_steps"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-600 justify-between flex gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <span>Number of inference steps</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-3 " />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Number of denoising steps. Recommended range is
                              28-50 for dev model and 1-4 for schnell mode.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div>{field.value}</div>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={
                          form.getValues("model") ===
                          "black-forest-labs/flux-schnell"
                            ? 4
                            : 50
                        }
                        step={1}
                        onValueChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="output_quality"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-gray-600 justify-between flex gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <span>Output Quality</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="size-3 " />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Quality when sabing the output image. from 0 to
                              100. 100 is best quality, 0 is the lowest quality.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div>{field.value}</div>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={100}
                        step={1}
                        onValueChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600 flex gap-2 items-center">
                    Output Format
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3 " />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Format of the output image.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="webp">Webp</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-gray-600 flex gap-2 items-center">
                    Prompt
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="size-3 " />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Prompt for generated images.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea className="h-30" rows={6} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="font-medium">
              Generate
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
};

export default Configuration;
