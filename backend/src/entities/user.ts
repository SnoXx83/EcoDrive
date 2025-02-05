import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "./trip";
import { Booking } from "./booking";

enum UserType{
    PASSENGER = 'passenger',
    DRIVER = 'driver',
}

@ObjectType()
@Entity()
export class User extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    first_name: string;

    @Field()
    @Column()
    last_name: string;

    @Field()
    @Column()
    email:string;

    @Field()
    @Column()
    password: string;

    @Field()
    @Column()
    phone_number: string;

    @Field()
    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.PASSENGER,
    })
    user_type: UserType;

// Un utilisiateur(Conducteur) peut avoir plusieurs trajets.
@OneToMany(()=> Trip, (trip)=> trip.driver)
trips: Trip[]

// Un utilisateur (passager) peut avoir plusieurs réservations.
@OneToMany(()=> Booking, (booking)=> booking.passenger)
bookings: Booking[];

}