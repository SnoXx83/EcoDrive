import { Arg, ID, Mutation, Resolver } from "type-graphql";
import { Booking } from "../entities/booking";
import { Trip } from "../entities/trip";
import { User } from "../entities/user";

@Resolver()
export class BookingResolver {
    @Mutation(() => Booking)
    async createBooking(
        @Arg("tripId") tripId: number,
        @Arg("passengerId", ()=> ID) passengerId: string,
        @Arg("numberOfSeats") numberOfSeats: number,
        @Arg("bookingStatus") bookingStatus: string,
    ): Promise<Booking> {
        const trip = await Trip.findOne({ where: { id: tripId } });
        if (!trip) {
            throw new Error("Trip not found");
        }

        const passenger = await User.findOne({ where: { id: parseInt(passengerId) } });
        if (!passenger) {
            throw new Error("Passenger not found");
        }

        const availablePlaces = parseInt(trip.available_place); // Convertir en nombre

        if (numberOfSeats > availablePlaces) {
            throw new Error("Not enough available places");
        }

        const booking = Booking.create({
            numberOfSeats,
            passenger,
            trip,
            bookingStatus,
        });

        await booking.save();

        trip.available_place = (availablePlaces - numberOfSeats).toString(); // Mettre à jour et reconvertir en string
        await trip.save();

        return booking;
    }
}