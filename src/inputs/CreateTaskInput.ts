import { InputType, Field } from "type-graphql";

@InputType()
export class CreateTaskInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field({ nullable: true })
    assignedTo?: string;

}