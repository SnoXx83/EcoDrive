import { gql } from "@apollo/client";

// Schema trouver les trajets par critères
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
`;



export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      last_name
      first_name
      email
    }
  }
`;

export const GET_ALL_TRIPS= gql`
  query GetAllTrips{
    getAllTrips {
      id
      departure_time
      start_location
      end_location
    }
  }
`

// Schema trouver un trajet par l'id
export const GET_TRIP_BY_ID = gql`
  query GetTripById($id: ID!) {
    getTripById(id: $id) {
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

// Schema se connecter
export const LOGIN_QUERY = gql`
    query Login($userData: LoginInput!) {
        login(UserData: $userData)
    }
`;

// Schema de verification
export const GET_AUTH_INFO = gql`
query WhoAmI {
  whoAmI {
    isLoggedIn
    userId
    email
    role
  }
}
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($id: Float!) {
    getUserById(id: $id) {
      id
      imageUrl
      first_name
      last_name
      email
      phone_number
      role
    }
  }
`;