import "reflect-metadata";
import dataSource from "./config/db";
import { ApolloServer } from "@apollo/server";
import * as jwt from "jsonwebtoken";
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSchema } from "type-graphql";
import { TripResolver } from "./resolvers/Trip";
import { UserResolver } from "./resolvers/User";
import { BookingResolver } from "./resolvers/Booking";

console.log("hello world");

const start = async () => {
    await dataSource.initialize();
    const schema = await buildSchema({
        resolvers: [TripResolver, UserResolver, BookingResolver],
        // Propriété qui vérifie pour chaque requête qui possède Authorized() si OK
        authChecker: ({ context }, roles) => {
            console.log("roles", roles);
            if (roles.length > 0 && context.email) {
                if (roles.includes(context.role)) {
                    console.log("ok");
                    return true;
                } else {
                    console.log("you are a user but you don t have the correct role");
                    return false;
                }
            }
            if (roles.length === 0 && context.email) {
                return true;
            }
            return false;
        }
    });

    const server = new ApolloServer({
        schema,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        // On sait quel utilisateur fait la requête
        context: async ({ req }) => {
            const token = req.headers.authorization?.split("Bearer ")[1];
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