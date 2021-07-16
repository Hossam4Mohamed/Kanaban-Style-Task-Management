import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateTask {
    @Field()
    id: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;
}
