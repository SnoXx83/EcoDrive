import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Trip } from "./trip";
import { Booking } from "./booking";


export type UserRoleType = "admin" | "passenger" | "driver";


@ObjectType()
@Entity()
export class User extends BaseEntity {
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
    imageUrl: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field()
    @Column()
    hashedPassword: string;

    @Field()
    @Column()
    phone_number: string;

    @Field()
    @Column({
        type: 'enum',
        enum: ["admin", "passenger", "driver"],
        default: "passenger",
    })
    role: UserRoleType;

    // // Un utilisiateur(Conducteur) peut avoir plusieurs trajets.
    @Field(()=> [Trip])
    @OneToMany(() => Trip, (trip) => trip.driver)
    trips: Trip[]

    // // Un utilisateur (passager) peut avoir plusieurs réservations.
    @Field(() => [Booking])
    @OneToMany(() => Booking, (booking) => booking.passenger)
    bookings: Booking[];
}