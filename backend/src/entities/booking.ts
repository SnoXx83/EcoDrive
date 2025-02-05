import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";


export class Booking extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    trip_id: string;

    @Column()
    passager_id: string;

    @Column()
    number_of_seats: string;

    @Column()
    booking_status: string;

}