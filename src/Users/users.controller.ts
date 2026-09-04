import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
// import { AuthGuard } from "src/common/auth.guard";
import { UseInterceptors } from "@nestjs/common";
import { LoggerInterceptor } from "src/common/logger.interceptor";

import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { GetUserDto } from "./dto/get-users.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";


@ApiTags('Users')
@Controller('users')
@UseInterceptors(LoggerInterceptor)
export class UsersController{
    constructor(private userService:UsersService){}
    
    @ApiBearerAuth()
    @Get()
    @UseInterceptors(CacheInterceptor)
    // @UseGuards(AuthGuard)
    
    getUsers(
        @Query() query:GetUserDto

        // @Query('name')
        // name?:string
    ){
        return this.userService.getUsers(query);
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
            createUserDto
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
    @Roles('User')
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.userService.deleteUser(id);
    }
}