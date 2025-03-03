import { gql } from "@apollo/client";
// Création d'une mutation GraphQL à l'aide de la balise littérale gql
// Schéma mutation creer un nouveau trajet
export const CREATE_NEW_TRIP = gql` 
mutation Mutation($tripData: TripInput!) {
  createNewTrip(TripData: $tripData) {
    id
  }
}
`
// Schéma mutation update un trajet
export const UPDATE_TRIP = gql`
  mutation UpdateTrip($id: Float!, $tripData: TripInput!) {
    updateTrip(id: $id, tripData: $tripData) {
      id
      departure_time
      start_location
      end_location
      available_place
      price
      owner
      description
    }
  }
`;