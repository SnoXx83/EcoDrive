
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Trip } from "./trip";

@ObjectType()
@Entity()
export class Booking extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    trip_id: string;

    @Field()
    @Column()
    passager_id: string;

    @Field()
    @Column()
    number_of_seats: string;

    @Field()
    @Column()
    booking_status: string;

    // Une réservation est effectuée par un seul utilisateur (passager).
    @ManyToOne(()=> User, (user)=> user.bookings)
    passenger: User;

    // Une réservation est liée à un seul trajet.
    @ManyToOne(()=> Trip, (trip)=> trip.bookings)
    trip: Trip;

}