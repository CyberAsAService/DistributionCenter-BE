import {Entity, Column, PrimaryColumn} from "./node_modules/typeorm";

@Entity()
export class Endpoint {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    ip: string;

    @Column()
    lastLogOnSuccess: Date;

    @Column()
    ldapPath: string;
}