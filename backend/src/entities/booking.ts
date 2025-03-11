import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Trip } from "./trip";

@ObjectType()
@Entity()
export class Booking extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    numberOfSeats: number;

    @Field()
    @Column()
    bookingStatus: string;

    // Une réservation est effectuée par un seul utilisateur (passager).
    @Field(()=> User)
    @ManyToOne(()=> User, (user)=> user.bookings)
    passenger: User;

    // // Une réservation est liée à un seul trajet.
    @Field(()=> Trip)
    @ManyToOne(()=> Trip, (trip)=> trip.bookings)
    trip: Trip;

}