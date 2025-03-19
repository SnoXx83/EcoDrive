import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { TripInput } from "../inputs/trip";
import { Between, Like, MoreThanOrEqual } from "typeorm";
import { TripUpdateInput } from "../inputs/TripUpdate";
import { User } from "../entities/user";

@Resolver()
export class TripResolver {

    // Trouver tout les trajets
    @Authorized()
    @Query(() => [Trip])
    async getAllTrips() {
        const result = await Trip.find();
        return result;
    }


    @Mutation(()=> Trip, {nullable: true})
    async deleteTrip(@Arg("id") id: number){
        try {
            const trip = await Trip.findOne({ where: { id } });
            if(!trip){
                return null;
            }
            const deletedTrip = {...trip};
            await trip.remove();
            return deletedTrip;
        } catch (error) {
            console.error("Erreur lors de la suppression du trajet: ", error);
            throw new Error("Erreur lors de la suppression du trajet.");
        }
    }

    // Trouver les trajets selon la recherche 
    @Query(() => [Trip], { nullable: 'items' })
    async getTripsByCriteria(
        @Arg('departureTime', { nullable: true }) departureTime?: string,
        @Arg('startLocation', { nullable: true }) startLocation?: string,
        @Arg('endLocation', { nullable: true }) endLocation?: string,
    ) {
        const where: any = {};
        
        if (departureTime) {
            where.departure_time = MoreThanOrEqual(departureTime); 
          }

        if (startLocation) {
            where.start_location = Like(`%${startLocation}%`); // Recherche partielle
        }

        if (endLocation) {
            where.end_location = Like(`%${endLocation}%`);
        }

        return await Trip.find({ where });
    }

    // Creation d'un trajet
    @Authorized()
    @Mutation(() => Trip)
    async createNewTrip(@Arg("TripData") tripData: TripInput,
        @Ctx() ctx: { email: string }
    ) {
        const user = await User.findOne({ where: { email: ctx.email, role: "driver" } });
        if (!user) {
            throw new Error("User not found or not a driver.");
        }

        const trip = Trip.create({
            ...tripData,
            driver: user,
            owner: ctx.email,
        })
        return await trip.save();
    }

    // Trouver un trajet par ID
    @Authorized()
    @Query(() => Trip, { nullable: true })
    async getTripById(@Arg('id', ()=> ID) id: string): Promise<Trip | null> {
        return await Trip.findOne({ where: { id: parseInt(id) } });
    }

    // Trouver tout les trajets
    @Query(() => [Trip], { nullable: true })
    async getAllTrip() {
        const result = await Trip.find();
        return result;
    }

    // Modifier un trajet par ID
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
