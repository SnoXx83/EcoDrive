import { Arg, AuthenticationError, Authorized, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import { UserInput } from "../inputs/user";
import * as jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { LoginInput } from "../inputs/login";
import { UpdateUserInput } from "../inputs/updateUser";
import dataSource from "../../config/db";

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

    @Mutation(() => User, { nullable: true })
    async deleteUser(@Arg("id") id: number) {
        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return null;
            }
            const deleteUser = { ...user };
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
            newUser.role = newUserData.role;
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
                throw new AuthenticationError("Mot de passe invalide");
            } else {
                const payload = { email: user.email, role: user.role };
                const token = jwt.sign(payload, "mysupersecretkey");
                return token;
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            if (error instanceof AuthenticationError) {
                throw error;
            }
            throw new Error("Erreur lors de la connexion");
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

    // Récupère un user par id
    @Query(() => User, { nullable: true })
    async getUserById(@Arg('id') id: number) {
        const userId = id;
        if (isNaN(userId)) {
            return null; // Gérer le cas où id n'est pas un nombre valide
        }
        return User.findOne({ where: { id: userId } });
    }

    // Update le user
    @Mutation(() => User)
    async updateUserById(@Arg('id') id: number, @Arg('userData') userData: UpdateUserInput) {
        try {
            const userRepository = dataSource.getRepository(User);
            let user = await userRepository.findOne({ where: { id } });
            if (!user) {
                return undefined;
            }
            if (userData.newPassword) {
                if (!userData.oldPassword) {
                    throw new Error('Veuillez fournir votre ancien mot de passe.');
                }

                const passwordMatch = await argon2.verify(user.hashedPassword, userData.oldPassword);
                if (!passwordMatch) {
                    throw new Error('Ancien mot de passe incorrect.');
                }

                const hashedPassword = await argon2.hash(userData.newPassword);
                user.hashedPassword = hashedPassword;
            }
            userRepository.merge(user, userData);

            user = await userRepository.save(user);

            return user;

        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            throw new Error(`Impossible de mettre à jour l\'utilisateur:`);
        }
    }
}