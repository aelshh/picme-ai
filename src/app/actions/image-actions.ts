"use server";
import { imageGenerationSchema } from "@/components/image-generation/Configuration";
import { z } from "zod";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/datatypes.types";
import { imageMeta } from "image-meta";
import { randomUUID } from "crypto";
import { getCredits } from "./credit-actions";

interface GenerateImageResponse {
  success: boolean;
  error: unknown | boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
}

export async function generateImageAction(
  input: z.infer<typeof imageGenerationSchema>
): Promise<GenerateImageResponse> {



  if(!process.env.REPLICATE_API_TOKEN){
    return {
      error: "Misisng REPLICATE_API_TOKEN in environment variables", 
      success: false,
      data: null
    }
  }

  const {data: credits} = await getCredits()

  if(!credits?.image_generation_count || credits.image_generation_count <= 0){
    return {
      error: 'No credits available',
      success: false, 
      data: null
    }
  }



  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    useFileOutput: false,
  });





  const modelInput = input.model.startsWith("adarsh-9919")?{
    model: "dev",
    lora_scale: 1,
    prompt: input.prompt,
    extra_lora_scale: 0,
    guidance: input.guidance,
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,

  }: {
    prompt: input.prompt,
    go_fast: true,
    guidance: input.guidance,
    megapixels: "1",
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  };
 
  try {
    const output = await replicate.run(input.model as `${string}/${string}`, {
      input: modelInput,
    });

    return {
      success: true,
      error: false,
      data: output,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      data: null,
    };
  }
}

type StoreImageInput = {url: string} & Database["public"]["Tables"]["generated_images"]["Insert"]
   


export async function imgUrltoBlob(url: string){
  const reponse =  fetch(url);
  const blob = (await reponse).blob()
  return (await blob).arrayBuffer()


}


export async function storeImages(data: StoreImageInput[]) {
  const supabase = await createClient();

  const { data: {user} } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  } 

  const uploadResults = []


  for (const img of data){
    const arrayBuffer = await imgUrltoBlob(img.url)
    const {width , height, type} = imageMeta(new Uint8Array(arrayBuffer))
    const fileName = `image_${randomUUID()}.${type}`
    const filePath = `${user.id}/${fileName}`

    const {error: storageError} = await supabase.storage.from('generated-images').upload(
      filePath, arrayBuffer, {
        contentType: `image/${type}`,
        cacheControl: '3600',
        upsert: false
      }
    )
    if(storageError){
      uploadResults.push({
        fileName, 
        error: storageError, 
        success: false, 
        data: null
      })
      continue;
    }

    const { data: dbdata , error: dbError} = await supabase.from('generated_images').insert([{
        user_id: user.id, 
        model:  img.model, 
        prompt: img.prompt, 
        aspect_ratio: img.aspect_ratio, 
        guidance: img.guidance, 
        num_inference_steps: img.num_inference_steps, 
        output_format: img.output_format,
        image_name: fileName, 
        width, 
        height
    }]).select( )

    if(dbError){
       uploadResults.push({
        fileName, 
        error: dbError.message, 
        success: !dbError, 
        data: dbdata || null
      })
      continue

    }

  

  }


  console.log(uploadResults)

    return {
      error: null,
      success: true, 
     data:  {results: uploadResults}
    }



}
export async function getImages(limit?: number) {
  const supabase = await createClient();

  const { data: {user} } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  } 


  let query  = supabase.from('generated_images').select("*").eq("user_id", user.id).order("created_at",{ascending: false})

  if(limit){
    query = query.limit(limit)
  }

  const {data, error} = await query;

  if(error){
     return {
      error: error.message || "Failed to fetch images!",
      success: false, 
     data:  null
    }
  }

  const imageWithUrl  = await Promise.all(
    data.map( async (image: Database["public"]["Tables"]["generated_images"]["Row"]) => {
      const {data} = await supabase.storage.from("generated-images").createSignedUrl(`${user.id}/${image.image_name}`, 3600)

      return {
        ...image, 
         url: data?.signedUrl
      }
    })
  )


    return {
      error: null,
      success: true, 
     data:  imageWithUrl || null
    }



}
export async function deleteImages(id: string, imageName: string) {
  const supabase = await createClient();

  const { data: {user} } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Unauthorized",
      success: false,
      data: null,
    };
  } 

  const {data, error} = await supabase.from("generated_images").delete().eq('id', id)

  if(error){
    return {
      error: error.message ,
      success: false, 
      data: null
    }
  }

  await supabase.storage.from("generated-images").remove([`${user.id}/${imageName}`])


  


    return {
      error: null,
      success: true, 
     data
    }



}
