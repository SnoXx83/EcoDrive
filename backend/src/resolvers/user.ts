import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";

@Resolver()
export class UserResolver{
    @Query(()=> [User])
    async getAllUsers(){
        const result = await User.find()
        return result;
    }
}