import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    groupId: number;
}