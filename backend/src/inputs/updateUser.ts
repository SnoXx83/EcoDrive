import { InputType, Field } from "type-graphql";

// Input d'inscription rename register
@InputType()
export class UpdateUserInput {
    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    imageUrl: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    oldPassword?: string;
  
    @Field({ nullable: true })
    newPassword?: string;

    @Field()
    phone_number: string;
}