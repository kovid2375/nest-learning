import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('users')
export class UsersController{
    constructor(private userService:UsersService){}

    @Get()
    getUsers(
        @Query('page',new DefaultValuePipe(1),ParseIntPipe)
        page:number,

        @Query('limit',new DefaultValuePipe(10),ParseIntPipe)
        limit:number,

        @Query('name')
        name?:string
    ){
        return this.userService.getUsers(page,limit,name);
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
    @Delete(':id')
    deleteUser(@Param('id')id:string){
        return this.userService.deleteUser(Number(id))
    }
}