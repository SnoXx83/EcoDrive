import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { UserInput } from "../inputs/user";
import * as argon2 from "argon2";

@Resolver()
export class UserResolver {

    @Query(() => [User])
    async getAllUsers() {
        const result = await User.find();
        return result;
    }

    @Mutation(() => User)
    async register(@Arg("newUserData") newUserData: UserInput) {
        try {
            const newUser = new User();
            newUser.email = newUserData.email;
            newUser.first_name = newUserData.first_name;
            newUser.last_name = newUserData.last_name;
            newUser.phone_number = newUserData.phone_number;
            if (newUserData.password) {
                newUser.password = await argon2.hash(newUserData.password);

            } else {
                return "Password is required";
            }
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log("error:", error);
            return "error while creating new user";
        }
    }
}