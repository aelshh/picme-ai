import { NextResponse } from "next/server"

export async function POST(req:Request){
 try{
   
    const data =  await req.json()
    console.log("webhook", data)

    return NextResponse.json({
        success: true
    }, {status: 201})
 }
 catch(error){
    console.log("Webhook processing error: ",error)
    return new NextResponse("Internal server error",{status: 500})
 }
}