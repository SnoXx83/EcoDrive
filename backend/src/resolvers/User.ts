import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { UserInput } from "../inputs/user";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { LoginInput } from "../inputs/login";

@Resolver()
export class UserResolver {
    // met en place AuthChecker dans index.ts pour vérifier
    @Authorized()
    @Query(() => [User])
    async getAllUsers() {
        const result = await User.find();
        return result;
    }

    // Mutation pour créer un User
    @Mutation(() => User)
    async register(@Arg("newUserData") newUserData: UserInput) {
        try {
            const newUser = new User();
            newUser.email = newUserData.email;
            newUser.first_name = newUserData.first_name;
            newUser.last_name = newUserData.last_name;
            newUser.imageUrl= newUserData.imageUrl;
            newUser.phone_number = newUserData.phone_number;
            if (newUserData.password) {
                newUser.hashedPassword = await argon2.hash(newUserData.password);

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

    // Query pour se connecter
    @Query(() => String)
    async login(@Arg("UserData") UserData: LoginInput) {
        try {
            const user = await User.findOneByOrFail({ email: UserData.email });
            if (
                (await argon2.verify(user.hashedPassword, UserData.password)) === false
            ) {
                return "invalid password";
            } else {
                const token= jwt.sign({email: user.email}, "mysupersecretkey");
                console.log("Token: ",token);
                return token
            }
        } catch (error) {
            console.log("error : ", error);
            return "invalid credentials";
        }
    }
}