import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class Task {

    @PrimaryColumn()
    id: number;

    @Column()
    endpoints_id: string;

    @Column()
    user_id: string;

    @Column()
    command: string;

    @Column()
    status: number;

    @Column()
    result: string;
}