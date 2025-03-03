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
            where.start_location = Like(`%${startLocation}%`); // Recherche partielle
        }

        if (endLocation) {
            where.end_location = Like(`%${endLocation}%`); 
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

    @Query(() => Trip, { nullable: true })
    async getTripById(@Arg('id') id: number): Promise<Trip | null> {
        return await Trip.findOne({ where: { id } });
    }

    @Mutation(() => Trip, { nullable: true })
    async updateTrip(
        @Arg('id') id: number,
        @Arg('tripData') tripData: TripInput,
    ): Promise<Trip | undefined> {
        const trip = await Trip.findOne({ where: { id } });
        if (!trip) {
            return undefined; // Ou lancez une erreur
        }

        // Mise à jour des propriétés du trajet
        trip.start_location = tripData.start_location;
        trip.end_location = tripData.end_location;
        trip.departure_time = tripData.departure_time;
        trip.available_place = tripData.available_place;
        trip.price = tripData.price;
        trip.owner = tripData.owner;
        trip.description = tripData.description;

        return await Trip.save(trip);
    }
}
