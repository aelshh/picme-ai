import z from "zod";
import { create } from "zustand";
import { imageGenerationSchema } from "@/components/image-generation/Configuration";
import { generateImageAction, storeImages } from "@/app/actions/image-actions";
import { toast } from "sonner";

interface GenerateState {
  error: null | unknown;
  loading: boolean;
  images: Array<{ url: string }> | null;
  generateImage: (
    Values: z.infer<typeof imageGenerationSchema>
  ) => Promise<void>;
}

const useGenerateStore = create<GenerateState>((set) => ({
  error: null,
  images: [],
  loading: false,

  generateImage: async (values: z.infer<typeof imageGenerationSchema>) => {
    set({ loading: true, error: null });

    const toastId = toast.loading("Generating image...")

    try {
      const { error, success, data } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      console.log("data", data);

      const dataWithUrl = data.map((url: string) => {
        return {
          url,
          ...values
        };
      });

      set({ images: dataWithUrl, loading: false });
      toast.success("Image generated successfully!" , {id: toastId})

      await storeImages(dataWithUrl)

      return;
    } catch (error) {
      console.error(error);
      set({
        error: "Failed to generate image. Please try again.",
        loading: false,
      });
    }
  },
}));

export default useGenerateStore;
