import "reflect-metadata";
import * as TypeORM from "typeorm";
import { ApolloServer } from "apollo-server";
import { Task } from "./models/task";
import { taskUpdates } from "./models/taskUpdates";
import { createSchema } from "./helpers/createSchema";



async function main() {
    try {
        await TypeORM.createConnection({
            name: "default",
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "password",
            database: "kanban",
            entities: [Task, taskUpdates],
            synchronize: true
        });
        const schema = await createSchema();
        const server = new ApolloServer({ schema });
        await server.listen(4000);
        console.log("Server has started!");
    } catch (error) {
        console.log("error", error);

    }

}

main();
