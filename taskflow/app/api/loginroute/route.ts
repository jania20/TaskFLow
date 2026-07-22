
//import { Prisma } from "@/app/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import { verify } from "@node-rs/argon2";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req: Request){
    
    try {
        
        const body = await req.json();
        const {email, password} = body;
       

    /*=============================
      VERIFY INPUTS ARE NOT EMPTY
    =============================*/
    if(!email || !password){
        return NextResponse.json(
            {error: "Inputs shouldnt be empty."},
            {status: 400}
        )
    }

    /*=======================================
        CHECK IF EMAIL EXIST IN DATABASE
    ========================================*/
    const validateEmail = await prisma.user.findUnique(
        {
            where :{ email}
        }
    )
    console.log(validateEmail);
    
    if(!validateEmail){
        return NextResponse.json(
            {error: "Email doesnt exist. Go to sign up section"}, 
            {status: 400}
        )
    }

   

    /*=======================================
        CHECK IF PASSWORD IS CORRECT
    ========================================*/
    const isValidPassword = await verify(validateEmail.password, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

    if(!isValidPassword){
        return NextResponse.json(
            {error: "Invalid password"},
            {status: 400}
        );
    }

    /*=====================================
        ASSIGN COOKIES
    =====================================*/
    const cookieStore = await cookies();

    const session= crypto.randomUUID(); //https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    
    console.log(session);
    cookieStore.set('sessionId', session);

    

    const saveSession = await prisma.session.create({
       data: {
            sessionId: session,
            userId: validateEmail.id,
            expiresAt: new Date()
        }
     })
     console.log("session" + saveSession);

    console.log("Email and password are correct");
    return NextResponse.json(
        {message: "Login succesfully"}, 
        {status: 200}
    )

   
    } catch (error) {
        /*===================
        ERROR  WHEN PAGE IS DOWn/BROKE
        ==================*/
        console.log(error)

        return NextResponse.json(
            {error: "Server error"}, 
            {status: 500}
        )
    }

    



}