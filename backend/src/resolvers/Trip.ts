import { Arg, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";

@Resolver()
export class TripResolver{
    @Query(()=> [Trip])
    async getAllUsers(){
        return await Trip.find()
    }
}