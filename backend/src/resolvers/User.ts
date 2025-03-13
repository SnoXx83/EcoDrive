import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
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
    @Field({ nullable: true })
    userId: number;
}

@Resolver()
export class UserResolver {
    // Trouver tout les utilisateurs pour admin
    @Authorized()
    @Query(() => [User])
    async getAllUsers() {
        const result = await User.find();
        return result;
    }

    @Mutation(()=> User, {nullable: true})
    async deleteUser(@Arg("id") id: number){
        try {
            const user = await User.findOne({ where: { id } });
            if(!user){
                return null;
            }
            const deleteUser= {...user};
            await user.remove();
            return deleteUser;
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur: ", error);
            throw new Error("Erreur lors de la suppression de l'utilisateur.");
        }
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
    async login(@Arg("UserData") UserData: LoginInput, @Ctx() ctx: any) {
        try {
            const user = await User.findOneByOrFail({ email: UserData.email });
            if (!(await argon2.verify(user.hashedPassword, UserData.password))) {
                return "invalid password";
            } else {
                const payload = { email: user.email, role: user.role };
                const token = jwt.sign(payload, "mysupersecretkey");
                return token;
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return "Erreur lors de la connexion";
        }
    }

    // Veririfie si la personne est connecté, l'user, email, et role 
    @Query(() => UserInfo)
    async whoAmI(@Ctx() ctx: { email: string; role: string }) {
        if (ctx.email !== undefined) {
            try {
                const user = await User.findOne({ where: { email: ctx.email } });
                if (user) {
                    return {
                        isLoggedIn: true,
                        userId: user.id,
                        email: ctx.email,
                        role: ctx.role,
                    };
                } else {
                    return { isLoggedIn: false };
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                return { isLoggedIn: false };
            }
        } else {
            return { isLoggedIn: false };
        }
    }

    @Query(() => User, { nullable: true })
    async getUserById(@Arg('id') id: number) {
        const userId= id;
        if (isNaN(userId)) {
            return null; // Gérer le cas où id n'est pas un nombre valide
        }
        return User.findOne({ where: {id: userId} });
    }
}