import { IsEmail, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";





export class CreateUserDto{
 @IsString()
 @IsNotEmpty()
 @MinLength(3)
 name:string

 @IsEmail()
 @IsNotEmpty()
 email:string

 @IsNumber()
 @IsNotEmpty()
 @Min(18,{
    message:'Age must be greater than or equal to 18'
 })
 age:number

 @IsString()
 @IsNotEmpty()
 @MinLength(6)
 password:string
}

