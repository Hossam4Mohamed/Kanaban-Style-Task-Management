import { graphql, GraphQLSchema } from "graphql";
//import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../../helpers/createSchema";

interface Options {
    source: string;
    // variableValues?: Maybe<{
    //     [key: string]: any;
    // }>;
}


let schema: GraphQLSchema

export const getGraphQL = async ({ source }: Options) => {
    if (!schema) {
        schema = await createSchema()
    }
    return graphql({
        schema,
        source,

    });
}