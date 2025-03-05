import Layout from "../components/Layout";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { createContext, Dispatch, SetStateAction, useState } from "react";

// On définit un context initial avec un objet contenant 2 elements, le statut du User(connecté ou non) et une fonction(met a jour le boolean isLoggedIn)
const initialContext: {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
} = {
  isLoggedIn: false,
  setIsLoggedIn: () => { },
};

export const AuthContext = createContext(initialContext);

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const authLink = setContext((_, { headers }) => {
  // je récupère le token d'authentification du localstorage si il existe
  const token = localStorage.getItem("jwt");
  // Je retourne le headers au context pour que httpLink puisse les lires
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App({ Component, pageProps }: AppProps) {
  console.log("localstorage jwt", localStorage.getItem("jwt"));
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("jwt") !== null
  );
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
