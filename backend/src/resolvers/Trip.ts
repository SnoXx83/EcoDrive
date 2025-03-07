import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { TripInput } from "../inputs/trip";
import { Like } from "typeorm";
import { TripUpdateInput } from "../inputs/TripUpdate";

@Resolver()
export class TripResolver {

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

    @Authorized()
    @Mutation(() => Trip)
    async createNewTrip(@Arg("TripData") tripData: TripInput,
        @Ctx() ctx: { email: string }
    ) {
        return await Trip.save({
            ...tripData,
            owner: ctx.email,
        });
    }

    @Authorized()
    @Query(() => Trip, { nullable: true })
    async getTripById(@Arg('id') id: number): Promise<Trip | null> {
        return await Trip.findOne({ where: { id } });
    }

    @Authorized()
    @Mutation(() => Trip, { nullable: true })
    async updateTrip(
        @Arg('id') id: number,
        @Arg('tripData') tripData: TripUpdateInput,
        @Ctx() ctx: { email: string, role: string }
    ): Promise<Trip | undefined> {
        const tripToUpdate = await Trip.findOneByOrFail({ id: id });
        if (tripToUpdate.owner !== ctx.email && ctx.role !== "admin") {

            throw new Error("You cannot edit this trip");
        }
        const newTripData: any = { ...tripData };
        return await Trip.save({ id, ...newTripData });
    }
}
