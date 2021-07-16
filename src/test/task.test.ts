import { Connection } from "typeorm";
import { testConn } from "./test-utils/testConn";
import { getGraphQL } from "./test-utils/getGraph";
import { Task } from "../models/task";


let dbConnection: Connection;
beforeAll(async () => {
    dbConnection = await testConn();
})

afterAll(async () => {
    await dbConnection.close();
})




describe('Test Task Module', () => {
    let createdTask: Task;
    let taskId: string;
    it('Create New Task ', async () => {
        const createTaskMutation = `
        mutation { createTask(
            data: {
                title: "newTask",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lectus vitae metus placerat venenatis non eu neque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus consectetur orci vel magna vehicula, sed elementum nisl lacinia. Praesent consectetur sollicitudin metus, a tristique est pellentesque in. Donec feugiat quam vitae iaculis vehicula. Aenean ex nisi, porta sit amet diam sit amet, ultrices feugiat lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque efficitur sem eros, ut finibus nunc sagittis in. Maecenas tristique risus arcu, nec convallis mauris vulputate nec.",
            })
                {
                    id,
                    title,
                    description,
                    status,
                    createdBy,
                    assignedTo,
                    createdAt      
                }
        }`;

        const task = await getGraphQL({ source: createTaskMutation })
        expect(task.data.createTask.title).toBe('newTask');
        expect(task.data.createTask.description).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel lectus vitae metus placerat venenatis non eu neque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Phasellus consectetur orci vel magna vehicula, sed elementum nisl lacinia. Praesent consectetur sollicitudin metus, a tristique est pellentesque in. Donec feugiat quam vitae iaculis vehicula. Aenean ex nisi, porta sit amet diam sit amet, ultrices feugiat lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque efficitur sem eros, ut finibus nunc sagittis in. Maecenas tristique risus arcu, nec convallis mauris vulputate nec.");
        expect(task.data.createTask.createdBy).toBe("08240d3f-87b1-485d-bc7d-8dd74790e806");
        expect(task.data.createTask.assignedTo).toBe(null);
        createdTask = task.data.createTask;
        taskId = createdTask.id
    })

    it('Get Created Task', async () => {
        const getCreatedTaskQuery =
            `query { 
                task(id: "${taskId}")
                {   id,
                    title,
                    description,
                    status,
                    assignedTo,
                    createdBy,
                    createdAt
                }
            }`

        const retrievedTask = await getGraphQL({ source: getCreatedTaskQuery })
        expect(retrievedTask.data.task).toMatchObject(createdTask);
    })

    it('Assign Task To User', async () => {
        const assignTaskMutation =
            `mutation { 
                assignTask(id: "${taskId}", assignTo: "0c4406f6-4b1a-4d52-bf3a-3f51784ab17e")
                {   id,
                    assignedTo
                }
            }`

        const assignedTask = await getGraphQL({ source: assignTaskMutation })
        expect(assignedTask.data.assignTask.assignedTo).toBe('0c4406f6-4b1a-4d52-bf3a-3f51784ab17e');
    })

    it('Update Task Title', async () => {
        const updateTaskTitleMutation =
            `mutation { 
                updateTaskTitle( 
                    data: {
                      id: "${taskId}", 
                      title: "updated title" 
                    })
                {   
                    id,
                    title
                }
            }`

        const taskWithUpdatedTitle = await getGraphQL({ source: updateTaskTitleMutation })
        expect(taskWithUpdatedTitle.data.updateTaskTitle.title).toBe('updated title');
    })

    it('Update Task Description', async () => {
        const updateTaskDescriptionMutation =
            `mutation { 
                updateTaskDescription( 
                    data: {
                      id: "${taskId}", 
                      description: "updated description, this is a new description to check that update description functionality is working properly" 
                    })
                {   
                    id,
                    description
                }
            }`

        const taskWithUpdatedDescription = await getGraphQL({ source: updateTaskDescriptionMutation })
        expect(taskWithUpdatedDescription.data.updateTaskDescription.description).toBe('updated description, this is a new description to check that update description functionality is working properly');
    })

    it('Change Task Status, It Should Fail', async () => {
        const changeTaskStatusMutation =
            `mutation { 
                changeStatus( 
                      id: "${taskId}", 
                      newStatus: "InQA" )
                {   
                    id,
                    status
                }
            }`

        const response = await getGraphQL({ source: changeTaskStatusMutation })
        expect(response).toHaveProperty('errors');
    })

    it('Change Task Status, It Should Succeed', async () => {
        const changeTaskStatusMutation =
            `mutation { 
                changeStatus( 
                      id: "${taskId}", 
                      newStatus: "InProgress" )
                {   
                    id,
                    status
                }
            }`

        const taskWithUpdatedStatus = await getGraphQL({ source: changeTaskStatusMutation })
        expect(taskWithUpdatedStatus.data.changeStatus.status).toBe('InProgress');
    })

    it('Get Task History', async () => {
        const taskHistoryQuery =
            `query { 
                taskHistory( 
                      id: "${taskId}")
                {   
                    taskId
                    updatePerformer,
                    updateType,
                    previousValue,
                    nextValue,
                    createdAt
                }
            }`

        const history = await getGraphQL({ source: taskHistoryQuery })
        expect(history.data.taskHistory).toHaveLength(4);

    })

})


