import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional,IsString,Max,Min,IsIn,IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { Role } from "@prisma/client";

export class GetUserDto{
    @ApiPropertyOptional({
        example:1,
        default:1
    })
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    page?:number=1;

    @ApiPropertyOptional({
        example:10,
        default:10
    })
    @IsOptional()
    @Type(()=>Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?:number=10


    @ApiPropertyOptional({
        example:'kovid'
    })
    @IsOptional()
    @IsString()
    search?:string


    @ApiPropertyOptional({
        example:'createdAt',
        default:'createdAt'
    })
    @IsOptional()
    @IsIn(['name','age','createdAt'])
    sortBy?:'name' | 'age' | 'createdAt' = 'createdAt'

    @ApiPropertyOptional({
        example: 'desc',
        default: 'desc',
    })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';


    @ApiPropertyOptional({
        enum:Role,
        example:Role.User
    })
    @IsOptional()
    @IsEnum(Role)
    role?:Role
}