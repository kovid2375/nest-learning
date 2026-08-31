import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { AuthGuard } from "src/common/auth.guard";
import { UseInterceptors } from "@nestjs/common";
import { LoggerInterceptor } from "src/common/logger.interceptor";

import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Users')
@Controller('users')
@UseInterceptors(LoggerInterceptor)
export class UsersController{
    constructor(private userService:UsersService){}

    @Get()
    // @UseGuards(AuthGuard)
    getUsers(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe)
        page:number,

        @Query('limit',new DefaultValuePipe(10),ParseIntPipe)
        limit:number,

        // @Query('name')
        // name?:string
    ){
        return this.userService.getUsers(page,limit);
    }
    
    // @Get('search')
    // getUserName(@Query('name')name?:string){
    //     return this.userService.getUsers(name)
    // }

    @Get(':id')
    getUserById(
        @Param('id',ParseIntPipe) id:number,
    ){
        return this.userService.getUserById(id)
    }


    @Post()
    createUser(@Body() createUserDto:CreateUserDto){
        return this.userService.createUser(
            createUserDto.name,
            createUserDto.email,
            createUserDto.age
        )
    }

    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe)id:number,
        @Body() updateUserDto:UpdateUserDto
    ){
        return this.userService.updateUser(id,updateUserDto)
    }

    @Put(':id')
    replaceUser(
        @Param('id',ParseIntPipe)id:number,
        @Body() createUserDto:CreateUserDto,
    ){
        return this.userService.replaceUser(
            id,
            createUserDto
        )
    }

    
    @Delete(':id')
    deleteUser(@Param('id')id:string){
        return this.userService.deleteUser(Number(id))
    }
}