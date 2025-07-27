import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";



const WEBHOOK_URL = process.env.SITE_URL


async function validateCredits(userId: string){
    const {data: userCredit, error} = await supabaseAdmin.from("credits").select("*").eq("user_id", userId).single()
    if(error) throw new Error("Error getting user credit")
    
    const credits  = userCredit.model_training_count ?? 0 
    if(credits <= 0 ){
        throw new Error("No credits left for training!")

    }
    return credits
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
})

export async function POST(request: NextRequest){


    try{

        if(!process.env.REPLICATE_API_TOKEN){
            throw new Error("The replicate api token is not set!")
        }
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()
        if(!user){
             return NextResponse.json({
            error: "Unauthorized", 

        }, {status: 401})

        }


        const formData =  await request.formData();

        const input = {
            filekey: formData.get("fileKey") as string, 
            gender: formData.get("gender") as string,
            model: formData.get("model") as string
        }

        if(!input.filekey || !input.model){
            return NextResponse.json({
                error: "Missing required fields!"
            }, {status: 400})
        }

        const oldCredtis =  await validateCredits(user.id)

        const fileName = input.filekey.replace("training-data/", "")

        const {data: fileUrl} = await supabaseAdmin.storage.from("training-data").createSignedUrl(fileName, 3600)
        if(!fileUrl?.signedUrl){
            throw new Error("Failed to get the URL!")
        }

    //create training model 

    // Sanitize the model name to meet Replicate's requirements
    const sanitizedModelName = input.model
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-') // Replace invalid characters with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    
    const modelId = `model_${Date.now()}_${sanitizedModelName}`

    await replicate.models.create("adarsh-9919",modelId, {
        visibility: "private", 
        hardware: "gpu-a100-large"

    } )

   const training =  await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "26dce37af90b9d997eeb970d92e47de3064d46c300504ae376c75bef6a9022d2",
      {
        destination: `adarsh-9919/${modelId}`,
        input: {
          steps: 1000,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "okhw",
          
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training?userId=${user.id}&fileName=${encodeURIComponent(fileName)}&modelId=${encodeURIComponent(modelId)}`,
        webhook_events_filter: ["completed"],
      }
    );



    // add model values in supabase 
 await supabaseAdmin.from("models").insert({
        model_id: modelId, 
        user_id: user.id, 
        model_name: input.model, 
        gender: input.gender, 
        training_status : training.status, 
        trigger_word: 'okhw',
        training_steps: 1000, 
        training_id: training.id
    })

    await supabaseAdmin.from("credits").update({model_training_count: oldCredtis -1 }).eq("user_id", user.id)





        return NextResponse.json({
            success: true
        }, {status: 201})



    }catch(error){
        const errorMessage = error instanceof Error ? error.message : "Failed to start  the training"
        return NextResponse.json({
            error: errorMessage, 

        }, {status: 500})
    }
}