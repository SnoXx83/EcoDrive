import Layout from "../components/Layout";
import "../styles/globals.css";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

let backend_url;

if (typeof window !== "undefined") {
  if (window.location.origin.startsWith("http://localhost")) {
    backend_url = "http://localhost:4000";
  } else {
    backend_url = "/graphql";
  }
}

console.log("backend url", backend_url);

//  création d'un lien HTTP pour se connecter au serveur GraphQL.
const httpLink = createHttpLink({
  uri: backend_url,
});

//  crée un lien Apollo qui modifie les headers des requêtes GraphQL.
const authLink = setContext((_, { headers }) => {
// A chaque requete il recupere le token JWT du localStorage
  const token = localStorage.getItem("jwt");
  // si token il existe, il ajoute un header authorization avec la valeur sinon header vide
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Création d'une instance Apollo client
const client = new ApolloClient({
  // combine les liens authLink et httpLink
  link: authLink.concat(httpLink),
  // Creation d'un cache pour stocker les resultats des req Graphql
  cache: new InMemoryCache(),
});

// Composant App est le point d'entrée de l'app next.js
function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      {/* Le composant Layout gère l'etat d'authentification */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

// Charge dynamiquement le composant et desactive le rendu côté serveur
export default dynamic(() => Promise.resolve(App), { ssr: false });
