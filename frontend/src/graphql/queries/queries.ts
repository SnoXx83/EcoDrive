import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Query{
    health: String
  }
`;

export const resolvers={
    Query: {
        health: ()=> 'OK'
    }
};