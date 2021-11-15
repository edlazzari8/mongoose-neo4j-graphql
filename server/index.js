const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const neo4j = require('neo4j-driver');
const {Neo4jGraphQL} = require('@neo4j/graphql');
const resolvers = require ('./GraphQL/resolvers/index');
const typeDefs = require('./GraphQL/schema/index');
const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "password")
);
mongoose.connect('mongodb://localhost:27017/libreriaboh589', {
    useNewUrlParser: true
});

const neoSchema = new Neo4jGraphQL({typeDefs,  driver, resolvers});
const server = new ApolloServer({
    schema: neoSchema.schema,
    
});
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
