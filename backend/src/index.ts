import "reflect-metadata";
import dataSource from "../config/db";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from "type-graphql";
import { TripResolver } from "./resolvers/Trip";
import { HealthResolver } from "./resolvers/Health";

console.log("hello world");

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({
      resolvers: [TripResolver, HealthResolver],
    });

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
    });

    console.log(`Server ready at: ${url} `);
};

start();