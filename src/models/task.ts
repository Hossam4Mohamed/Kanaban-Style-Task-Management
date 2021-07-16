import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Task extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column("text")
    description: string;

    @Field(() => String)
    @Column({ default: 'ToDo' })
    status: string;

    @Field(() => ID)
    @Column()
    createdBy: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    assignedTo?: string;

    @Field()
    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

}