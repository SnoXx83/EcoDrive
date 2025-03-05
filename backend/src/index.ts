import "reflect-metadata";
import dataSource from "../config/db";
import { ApolloServer } from "@apollo/server";
import * as jwt from "jsonwebtoken";
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from "type-graphql";
import { TripResolver } from "./resolvers/Trip";
import { HealthResolver } from "./resolvers/Health";
import { UserResolver } from "./resolvers/User";

console.log("hello world");

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({
        resolvers: [TripResolver, UserResolver, HealthResolver],
        // Propriété qui vérifie pour chaque requête qui possède Authorized() si c'est bon
        authChecker: ({ context }) => {
            if (context.email) {
                return true;
            } else {
                return false;
            }
        }
    });

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        // On sait quel utilisateur fait la requête
        context: async ({ req }) => {
            // console.log("headers", req.headers.authorization);
            const token = req.headers.authorization?.split("Bearer ")[1];
            // console.log(token)
            if (token) {
                const payload = jwt.verify(token, "mysupersecretkey");
                console.log(payload);
                return payload;
            }
            return {};
        },
    });

    console.log(`Server ready at: ${url} `);
};

start();