<h1  align="center"> Task Management (Kanban Style) </h1>

## Table of Contents

- [Introduction](#introduction)

- [Tech Stack](#tech-stack)

- [Prerequisites](#prerequisites)

- [API Documentation](#api-documentation)

- [How To Run the App](#how-to-run-the-app)

- [How To Run Tests](#how-to-run-tests)

- [Mutation Examples](#mutation-examples)

## Introduction
The goal is to implement an api for an application to manage **working tasks** following the rules below: 
- **As a user** I can create tasks, so that all tasks for a project can be tracked.
- **As a user** I can change the status of a Task, so that the progress of the project can be
tracked.
- **As a user** I can assign a task to another user, so that the responsibility of a task can be
visualized.
- **As a user** I will see the history of a Task, so that I can track the history of a task.

## Tech Stack
- JavaScript, NodeJs, TypeScript
- TypeGraphQL
- TypeORM, MySQL using DB Transactions
- Jest used for testing

## Prerequisites
To Run the app you will need to create 2 MySQL Databases, one for the app itself and the other for testing purpose.
  * App DB shall be Named: "kanban"
  * Test DB shall be Named: "kanbanTest"
  * OR you can select other names and change database parameter in DB Connection for both App DB (in index.ts) and Test DB (in test-utils/testConn.ts)

## API Documentation
- Open your browser and you can access GraphQL playground on `http://host:4000` For example: `localhost:4000`
- On the right hand side you can access app documentation by clicking on Docs to know how to use the app, which arguments should be passed and which to expect as response

## How to Run The App
- Clone the github repo cd into repo directory
- run `npm i` to install dependencies
- run `npm start` to start app
- if you faced issues with connecting to the database on starting the app, run the following commands against the database :
```msql
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
```  


## How To Run Tests
- run `npm run test`


## Mutation Examples:

- To Create a new task

```
mutation {
  createTask(
     data: {
      title: "task 1",
      description: "Lorem ipsum",
   }
  ){
    id,
    title,
    createdBy,
    createdAt,
    description
  }
}
```

- To edit task title
```
mutation{
  updateTaskTitle(
    data:{
      id: "taskId",
      title: "new task title"
    }
  )
  {
    title,
    description,
  }
}
```

- To edit task description
```
mutation{
  updateTaskDescription(
    data:{
      id: "taskId",
      description: "new task description"
    }
  )
  {
    title,
    description,
  }
}
```
