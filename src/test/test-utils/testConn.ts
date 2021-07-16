import { createConnection } from "typeorm"
import { Task } from "../../models/task";
import { taskUpdates } from "../../models/taskUpdates";





export const testConn = (drop: boolean = false) => {
    return createConnection({
        name: "default",
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "kanbanTest",
        entities: [Task, taskUpdates],
        dropSchema: drop,
        synchronize: drop
    })
}