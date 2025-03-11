import { InputType, Field } from "type-graphql";

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
}