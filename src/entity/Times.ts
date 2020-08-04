import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class Times {

    @PrimaryColumn()
    taskId: number;

    @Column()
    prevStatus: string;

    @Column()
    newStatus: string;

    @Column()
    dateTime: string;

   }