import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class GroupUsers {

    @PrimaryColumn()
    userId: number;

    @Column()
    groupId: number;

    @Column()
    joinAt: Date;

    @Column()
    ttl: number;

 
}