import { Field, InputType } from "type-graphql";

@InputType()
export class TripUpdateInput {
  @Field({ nullable: true })
  start_location: string;

  @Field({ nullable: true })
  end_location: string;

  @Field({ nullable: true })
  departure_time: string;

  @Field({ nullable: true })
  available_place: string;

  @Field({ nullable: true })
  owner: string;

  @Field({ nullable: true })
  price: number;

  @Field({ nullable: true })
  description: string;
}