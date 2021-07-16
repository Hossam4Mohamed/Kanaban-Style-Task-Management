import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Task } from "../models/task";
import { CreateTaskInput } from "../inputs/CreateTaskInput";
import { UpdateTask } from "../inputs/UpdateTaskInput";
import { getConnection } from "typeorm";
import { taskUpdates } from "../models/taskUpdates";
import { TaskStatus } from "../services/taskStatusService";


@Resolver(Task)
export class TaskResolver {


    @Query(() => Task)
    async task(@Arg("id") id: string) {
        try {
            const task = await Task.findOne({ where: { id } });
            if (!task)
                throw new Error("Task not found!");
            return task;
        } catch (error) {
            console.error(error);
            return error
        }


    }

    @Mutation(() => Task)
    async createTask(@Arg("data") data: CreateTaskInput) {
        try {
            const newTask = { ...data, createdBy: '08240d3f-87b1-485d-bc7d-8dd74790e806' }
            const task = Task.create(newTask);
            return await task.save();
        } catch (error) {
            console.error(error);
            return error;
        }

    }

    @Mutation(() => Task)
    async updateTaskTitle(@Arg("data") data: UpdateTask) {
        try {
            const task = await Task.findOne({ where: { id: data.id } });
            if (!task)
                throw new Error("Task not found!");

            if (data.title != task.title) {
                let taskCopy = { ...task };
                await getConnection().transaction(async transactionalEntityManager => {
                    let updatedTask = Object.assign(task, data);
                    updatedTask = await transactionalEntityManager.save(task);
                    const action = taskUpdates.create({
                        taskId: task.id,
                        updatePerformer: '08240d3f-87b1-485d-bc7d-8dd74790e806',
                        updateType: 'changeTitle',
                        previousValue: taskCopy.title,
                        nextValue: updatedTask.title,
                    })
                    await transactionalEntityManager.save(action);
                });
            }
            return task;
        } catch (error) {
            return error;
        }

    }

    @Mutation(() => Task)
    async updateTaskDescription(@Arg("data") data: UpdateTask) {
        try {
            const task = await Task.findOne({ where: { id: data.id } });
            if (!task)
                throw new Error("Task not found!");

            if (data.description != task.description) {
                let taskCopy = { ...task };
                await getConnection().transaction(async transactionalEntityManager => {
                    let updatedTask = Object.assign(task, data);
                    updatedTask = await transactionalEntityManager.save(task);
                    const action = taskUpdates.create({
                        taskId: task.id,
                        updatePerformer: '08240d3f-87b1-485d-bc7d-8dd74790e806',
                        updateType: 'changeDescription',
                        previousValue: taskCopy.description,
                        nextValue: updatedTask.description,
                    })
                    await transactionalEntityManager.save(action);


                });
            }

            return task;
        } catch (error) {
            return error;
        }

    }

    @Mutation(() => Task)
    async assignTask(@Arg("id") id: string, @Arg("assignTo") assignTo: string) {
        try {
            const task = await Task.findOne({ where: { id } });
            if (!task)
                throw new Error("Task not found!");

            if (task.assignedTo != assignTo) {
                let taskCopy = { ...task };
                task.assignedTo = assignTo
                await getConnection().transaction(async transactionalEntityManager => {
                    await transactionalEntityManager.save(task);
                    const action = taskUpdates.create({
                        taskId: task.id,
                        updatePerformer: '08240d3f-87b1-485d-bc7d-8dd74790e806',
                        updateType: 'assignTask',
                        previousValue: taskCopy.assignedTo,
                        nextValue: task.assignedTo,
                    })
                    await transactionalEntityManager.save(action);
                })
            }
            return task;
        } catch (error) {
            return error;
        }

    }

    @Mutation(() => Task)
    async changeStatus(@Arg("id") id: string, @Arg("newStatus") newStatus: string) {
        try {
            const task = await Task.findOne({ where: { id } });
            if (!task)
                throw new Error("Task not found!");

            if (task.status != newStatus) {
                let taskCopy = { ...task };
                if (TaskStatus.checkStatusUpdate(task.status, newStatus)) {
                    task.status = newStatus
                    await getConnection().transaction(async transactionalEntityManager => {
                        await transactionalEntityManager.save(task);
                        const action = taskUpdates.create({
                            taskId: task.id,
                            updatePerformer: '08240d3f-87b1-485d-bc7d-8dd74790e806',
                            updateType: 'changeTaskStatus',
                            previousValue: taskCopy.status,
                            nextValue: task.status,
                        })
                        await transactionalEntityManager.save(action);
                    })
                }
                else {
                    const possibleStatusChanges = TaskStatus.getPossibleStatusChanges(taskCopy.status)
                    throw new Error("This task can be updated to " + possibleStatusChanges.join(' or ') + ' Only');
                }
            }

            return task;
        } catch (error) {
            return error;
        }

    }
    @Query(() => [taskUpdates])
    async taskHistory(@Arg("id") id: string) {
        try {
            const task = await Task.findOne({ where: { id } });
            if (!task)
                throw new Error("Task not found!");
            return await taskUpdates.find({ where: { taskId: id } });
        } catch (error) {
            return error;
        }

    }


}