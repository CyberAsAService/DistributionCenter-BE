import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class Group {

    @PrimaryColumn()
    id: number;

    @Column()
    permissions: string;

    @Column()
    description: string;

}