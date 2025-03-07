import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User, UserRoleType } from "../entities/user";
import { UserInput } from "../inputs/user";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { LoginInput } from "../inputs/login";

// Input de connection
@ObjectType()
class UserInfo {
  @Field()
  isLoggedIn: boolean;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  role: string;
}

@Resolver()
export class UserResolver {
    // met en place AuthChecker dans index.ts pour vérifier
    // Trouver tout les users
    @Authorized()
    @Query(() => [User])
    async getAllUsers() {
        const result = await User.find();
        return result;
    }

    // creation d'un User
    @Mutation(() => User)
    async register(@Arg("newUserData") newUserData: UserInput) {
        try {
            const newUser = new User();
            newUser.email = newUserData.email;
            newUser.first_name = newUserData.first_name;
            newUser.last_name = newUserData.last_name;
            newUser.imageUrl = newUserData.imageUrl;
            newUser.phone_number = newUserData.phone_number;
            newUser.hashedPassword = await argon2.hash(newUserData.password);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log("error:", error);
            return "error while creating new user";
        }
    }

    //  Se connecter
    @Query(() => String)
    async login(@Arg("UserData") UserData: LoginInput) {
        let payload: {email: string; role: UserRoleType};
        const user = await User.findOneByOrFail({ email: UserData.email });
        if (
            (await argon2.verify(user.hashedPassword, UserData.password)) === false
        ) {
            return "invalid password";
        } else {
            payload= { email: user.email, role: user.role};
            const token = jwt.sign({ email: user.email, role: user.role }, "mysupersecretkey");
            console.log("Token: ", token);
            return token
        }
    }

    @Authorized("driver")
    @Query(()=> String)
    async driverQuery(){
        return "you are a driver"; 
    }

    // Query qui vérifie si on est connecter ou non 
    // @Ctx est un decorateur qui injecte le contexte dans la fonction
    // ctx definit le type du context attendu
    @Query(() => UserInfo)
    async whoAmI(@Ctx() ctx: { email: string; role: string }) {
      if (ctx.email !== undefined) {
        return { ...ctx, isLoggedIn: true };
      } else {
        return { isLoggedIn: false };
      }
    }
}