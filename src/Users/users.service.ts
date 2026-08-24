import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()

export class UsersService {
    private users=[
        {
            id:1,
            name:'Kovid',
            email:'kovid@gmail.com',
            age:23
        },
        {
            id:2,
            name:'Rahul',
            email:'rahul@gmail.com',
            age:21
        },
        {
            id:3,
            name:'Sherya',
            email:'sherya@gmail.com',
            age:22
        },
        {
            id:4,
            name:'Saurav',
            email:'saurav@gmail.com',
            age:25
        }
    ]

    getUsers(
        page:number=1,

        limit:number=10,
        name?:string
    ){
        let filteredUser=this.users
        
        // filter by name
        if(name){
            filteredUser=this.users.filter(
                (user)=>user.name.toLowerCase()===name.toLowerCase()
            )
        }
        //pagination
        const startIndex=(page-1) * limit;
        const endIndex=startIndex + limit;
        
        const data=filteredUser.slice(startIndex,endIndex)
        return{
            page,
            limit,
            total:filteredUser.length,
            data
        }


        
    }

   getUserById(id:number){
    const user=this.users.find(
        (user)=>user.id===id
    )
    if(!user){
        throw new NotFoundException('user not found')
    }
    return user
   }

    createUser(name: string, email: string, age: number) {
        const exittingUser=this.users.find(
            user=>user.email===email
        )
        if(exittingUser){
            throw new ConflictException('user already exists')
        }
        const newUser={
            id:this.users.length+1,
            name,
            email,
            age
        }
        this.users.push(newUser)
        return newUser
    }
    deleteUser(id: number) {
        const index = this.users.findIndex(users => users.id === id)
        if (index === -1) {
            throw new NotFoundException('User not Found')
        }
        return this.users.splice(index, 1)[0]
    }
}