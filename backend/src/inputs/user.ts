import { InputType, Field } from "type-graphql";
import { UserRoleType } from "../entities/user";

// Input d'inscription rename register
@InputType()
export class UserInput {
    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    imageUrl: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    phone_number: string;

    @Field(() => String)
    role: UserRoleType;
}