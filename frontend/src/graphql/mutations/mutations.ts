import { gql } from "@apollo/client";
// Création d'une mutation GraphQL à l'aide de la balise littérale gql
// analyse votre chaîne de requête ou de mutation GraphQL dans un arbre de syntaxe abstraite (AST) qu'Apollo Client peut comprendre et utiliser pour communiquer avec votre serveur GraphQL.
export const CREATE_NEW_TRIP = gql` 
mutation Mutation($tripData: TripInput!) {
  createNewTrip(TripData: $tripData) {
    id
  }
}
`