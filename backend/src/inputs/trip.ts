import { Field, InputType } from "type-graphql";

@InputType()
export class TripInput {
    @Field()
    start_location: string;

    @Field()
    end_location: string;

    @Field()
    departure_time: string;
    
    @Field()
    available_place: string;

    @Field()
    owner: string;

    @Field()
    price: number;

    @Field()
    description: string;
}