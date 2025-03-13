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

// Schema mutation update un user par son id
export const UPDATE_USER = gql`
  mutation UpdateUserById($id: Float!, $imageUrl: String!, $email: String!, $oldPassword: String!, $newPassword: String!, $first_name: String!, $last_name: String!, $phone_number: String!) {
    updateUserById(id: $id, userData: { imageUrl: $imageUrl, email: $email, oldPassword: $oldPassword, newPassword: $newPassword, first_name: $first_name, last_name: $last_name, phone_number: $phone_number }) {
      id
      email
      first_name
      last_name
      phone_number
      imageUrl
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

// Delete un user
export const DELETE_USER = gql`
  mutation DeleteUser($id: Float!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// Delete un trip
export const DELETE_TRIP = gql`
mutation DeleteTrip($id: Float!){
  deleteTrip(id: $id){
    id
  }
}
`
