const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInputObjectType } = require('graphql');

const app = express();

// Dados simulados (poderiam ser dados de um banco de dados real)
const books = [];

// Defina o tipo de livro
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: {
    title: { type: GraphQLString },
    author: { type: GraphQLString },
  },
});

// Defina o tipo de entrada para criar um livro
const BookInputType = new GraphQLInputObjectType({
  name: 'BookInput',
  fields: {
    title: { type: GraphQLString },
    author: { type: GraphQLString },
  },
});

// Defina o tipo de mutação
const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        input: { type: BookInputType },
      },
      resolve(parent, args) {
        const newBook = { title: args.input.title, author: args.input.author };
        books.push(newBook);
        return newBook;
      },
    },
  },
});

// Defina uma consulta simples para evitar o erro de "Query root type must be provided"
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    dummy: {
      type: GraphQLString,
      resolve() {
        return 'Dummy query';
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
