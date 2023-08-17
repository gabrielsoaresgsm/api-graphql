const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const app = express();

// Dados simulados (poderiam ser dados de um banco de dados real)
const tasks = [];

// Defina o tipo de tarefa
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLString }, // Identificador único para a tarefa
    title: { type: GraphQLString },
  },
});

// Defina o tipo de mutação
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newTask = { id: Date.now().toString(), title: args.title };
        tasks.push(newTask);
        return newTask;
      },
    },
  },
});

// Defina a consulta para listar as tarefas
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getTasks: {
      type: new GraphQLList(TaskType), // Usar GraphQLList para retornar uma lista de tarefas
      resolve() {
        return tasks;
      },
    },
  },
});

// Crie o esquema GraphQL
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
