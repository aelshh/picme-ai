import { NextResponse } from "next/server"
import Replicate from "replicate"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { Resend } from "resend";
import EmailTemplate from "@/components/email-template/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const replicate = new Replicate({auth: process.env.REPLICATE_API_TOKEN })


export async function POST(req:Request){
 try{

    const rawBody = await req.text()
    const body = JSON.parse(rawBody)
    console.log(body)
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")
    const modelId = url.searchParams.get("modelId")
    const fileName = url.searchParams.get('fileName')

    // verify webhook 

    const webhook_id = req.headers.get("webhook-id")
    const timestamp = req.headers.get("webhook-timestamp")
    const webhookSignature = req.headers.get("webhook-signature")

    const signedContent = `${webhook_id}.${timestamp}.${rawBody}`
    const secret = await replicate.webhooks.default.secret.get()
    const secretBytes =  Buffer.from(secret.key.split("_")[1], "base64")
    const signature = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64');
   console.log(signature);
   const expectedSignature = webhookSignature?.split(',')[1] || webhookSignature;
   const isValid = expectedSignature === signature;
   console.log(isValid);

   if(!isValid){
      console.log("Signature invalid, returning 401");
      return new NextResponse("Invalid Signature", {status: 401})
   }



   const {data: user, error: userError} = await supabaseAdmin.auth.admin.getUserById(userId || "")



   if(userError || !user || !user.user){
      console.log("User not found or error in user lookup, returning 401");
      return new NextResponse("User not found", {status: 401})
   }
    
   const userEmail = user.user.email ?? ""
   const username = user.user.user_metadata.fullName ?? ""


   if(body.status === "succeeded"){ 


      const {error} = await resend.emails.send({
         from: 'Picme AI <onboarding@resend.dev>',
         to:  [userEmail],
         subject: 'Update for your model training',
         react: EmailTemplate({username, message: `Your model training as been succeeded.`})
   
      })

      if(error){
         console.error(error)
         throw new Error(error.message || "Failed to send email"  )
      }

      

    const {error: supabaseModelUpdateError} =   await supabaseAdmin.from('models').update({
         training_status: body.status, 
         training_time: body.metrics?.predict_time ?? null , 
         version: body.version
      }).eq("user_id", userId).eq("model_id",modelId )




      if(supabaseModelUpdateError){
         console.log(supabaseModelUpdateError)
         throw new Error(supabaseModelUpdateError.message)
      }

    




   }else{
       const { error} = await resend.emails.send({
         from: 'Picme AI <onboarding@resend.dev>',
         to:  [userEmail],
         subject: 'Update for your model training',
         react: EmailTemplate({username, message: `Your model training as been ${body.status}.`})
   
      })

      if(error){
         console.error(error)
         throw new Error(error.message || "Failed to send email"  )
      }

      await supabaseAdmin.from('models').update({
         training_status: body.status, 
      }).eq("user_id", user.user.id).eq("model_id",modelId )

      
      
   }
   
   await supabaseAdmin.storage.from("training-data").remove([fileName || ""])


   

    return NextResponse.json({
      success: true
    },  {status: 201})
 }
 catch(error){
    console.log("Webhook processing error: ",error)
    return new NextResponse("Internal server error",{status: 500})
 }
}