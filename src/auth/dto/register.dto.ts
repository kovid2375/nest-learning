import { ApiProperty } from "@nestjs/swagger";
import { IsEAN, IsEmail, IsInt, IsString, Min, MinLength } from "class-validator";






export class RegisterDto{
    @ApiProperty({example:'Kovid Chouhan'})
    @IsString()
    name:string

    @ApiProperty({example:'[EMAIL_ADDRESS]'})
    @IsEmail()
    email:string

    @ApiProperty({example:21})
    @IsInt()
    @Min(18)
    age:number

    @ApiProperty({example:'password123',
        minLength:6,
    })
    @IsString()
    @MinLength(6)
    password:string

}