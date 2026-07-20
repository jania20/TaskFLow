
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "@node-rs/argon2";

export async function POST(request: Request){
    


    try {
    //to receive the information from postman
    const body = await request.json();
    const {name, lastname, email, password} = body;

    /*===========================
        EMPTY FIELD VALIDATIONS
    ============================*/
    if(!name || !email || !password){
        return NextResponse.json(
            {error: "Fields can not be empty"},
            {status:400 }
        );
    }

    /*==================================
    VALIDATE EMAIL FORMAT
    ==================================*/
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email)) {
		return NextResponse.json(
            {error: "Email invalid. Example: prueba1@gmail.com"}, 
            {status: 400}
        );
	}
    /*==================================
    VALIDATE NAME FORMAT
    ==================================*/
    if (!/^[a-zA-Z][a-zA-Z]*$/.test(name.trim())) {
		return NextResponse.json(
            {error: "Name can only contain letters"}, 
            {status: 400}
        );
	}

    /*==================================
    VALIDATE PASSWORD FORMAT
    ==================================*/
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/.test(password.trim())) {
		return NextResponse.json(
            {error: "Passowrd has to inlcude one capital letter, one number, a strange character and minimum lenght 6 strings"}, 
            {status: 400}
        );
	}

    /*===========================================
        CHECK IF EMAIL ALREADY EXISTS IN DATABSE
    ===========================================*/
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        },
    });
    if (existingUser){
        return NextResponse.json(
            {message:"Email already exists"}, 
            {status: 409}
        );
    }

    /*===================================
        HASHEAR PASSWORD
    ==================================*/
	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

    console.log(passwordHash);

    /*===================================
        CREATE NEW USER INSTANCE
    ===================================*/
    await prisma.user.create({
        data: {
           name, 
            lastname, 
            email, 
            password: passwordHash
        },
    });

    return NextResponse.json(
            {message: "User registered"}, 
            {status: 201}
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "Server error"}, 
            {status: 500}, 

        );
    }
   
    
    
  
}