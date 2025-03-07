import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Booking } from "./booking";

@ObjectType()
@Entity()
export class Trip extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    // @Field()
    // @Column()
    // createdAt: Date;

    @Field()
    @Column()
    start_location: string;

    @Field()
    @Column()
    end_location: string;

    @Field()
    @Column()
    departure_time: string;

    @Field()
    @Column()
    available_place: string;

    @Field()
    @Column()
    owner: string

    @Field()
    @Column()
    price: number;

    @Field()
    @Column()
    description: string;

    // @Field()
    // @Column()
    // status: string;

    // // Un trajet est créé par un seul utilisateur(conducteur).
    @ManyToOne(() => User, (user) => user.trips)
    driver: User;


    // // Un trajet peut avoir plusieurs réservations.
    // @OneToMany(()=> Booking, (booking)=> booking.trip)
    // bookings:Booking[];

}