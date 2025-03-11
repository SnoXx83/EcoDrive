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

// Schéma mutation créer un User
export const REGISTER_MUTATION = gql`
  mutation Register($newUserData: UserInput!) {
    register(newUserData: $newUserData) {
      id
      email
      first_name
      last_name
    }
  }
`;

// Schema mutation créer une reservation
export const CREATE_BOOKING = gql`
  mutation CreateBooking($tripId: Float!, $passengerId: ID!, $numberOfSeats: Float!, $bookingStatus: String!) {
  createBooking(tripId: $tripId, passengerId: $passengerId, numberOfSeats: $numberOfSeats, bookingStatus: $bookingStatus) {
    id
    numberOfSeats
    bookingStatus
    passenger {
      id
      last_name
    }
    trip {
      id
      description
    }
    createdAt
  }
}
`;
