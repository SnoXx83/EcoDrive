import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { TripInput } from "../inputs/trip";
import { Like } from "typeorm";

@Resolver()
export class TripResolver {
    @Query(() => [Trip])
    async getAllUsers() {
        return await Trip.find()
    }

    @Query(() => [Trip], { nullable: 'items' })
    async getTripsByCriteria(
        @Arg('departureTime', { nullable: true }) departureTime?: string,
        @Arg('startLocation', { nullable: true }) startLocation?: string,
        @Arg('endLocation', { nullable: true }) endLocation?: string,
    ) {
        const where: any = {};

        if (departureTime) {
            where.departure_time = Like(`%${departureTime}$%`);
        }

        if (startLocation) {
            where.start_location = Like(`%${startLocation}%`); // Recherche partielle si nécessaire
        }

        if (endLocation) {
            where.end_location = Like(`%${endLocation}%`); // Recherche partielle si nécessaire
        }

        return await Trip.find({ where });
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
