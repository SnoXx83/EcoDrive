import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { TripInput } from "../inputs/trip";

@Resolver()
export class TripResolver{
    @Query(()=> [Trip])
    async getAllUsers(){
        return await Trip.find()
    }

    @Mutation(() => Trip)
    async createNewTrip(@Arg("TripData") tripData: TripInput) {
         return await Trip.save({
                start_location: tripData.start_location,
                end_location: tripData.end_location,
                departure_time: tripData.departure_time,
                available_place: tripData.available_place,
                owner: tripData.owner,
                price: tripData.price,
                description: tripData.description,
                // createdAt: new Date(), // Ajout de createdAt
            });
    }
}