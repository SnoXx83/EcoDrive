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


export const GET_TRIPS_BY_CRITERIA = gql`
query GetTripsByCriteria($departureTime: String, $startLocation: String, $endLocation: String) {
  getTripsByCriteria(departureTime: $departureTime, startLocation: $startLocation, endLocation: $endLocation) {
    id
    departure_time
    start_location
    end_location
    available_place
    price
    owner
  }
}
`
