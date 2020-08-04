import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class GroupsEndpoints {

    @PrimaryColumn()
    EndpointsId: number;

    @Column()
    groupId: string;

    @Column()
    joinAt: Date;

    @Column()
    ttl:number;

}