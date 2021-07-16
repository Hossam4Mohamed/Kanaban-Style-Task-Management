import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class taskUpdates extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => ID)
    @Column()
    taskId: string;

    @Field(() => ID)
    @Column("text")
    updatePerformer: string;

    @Field(() => String)
    @Column()
    updateType: string;

    @Field({ nullable: true })
    @Column("text", { nullable: true })
    previousValue: string;

    @Field(() => String)
    @Column()
    nextValue: string;

    @Field()
    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

}