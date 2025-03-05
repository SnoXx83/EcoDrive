import { InputType, Field } from "type-graphql";

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
    password: string; // Mot de passe optionnel pour les mises à jour

    @Field()
    phone_number: string;
}