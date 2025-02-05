import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";


export class Trip extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: Date;

    @Column()
    start_location: string;

    @Column()
    end_location: string;

    @Column()
    departure_time: string;

    @Column()
    available_place: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    status: string;

}