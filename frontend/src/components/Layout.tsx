import { createContext, ReactNode } from "react";
import Header from "./Header";
import { useQuery } from "@apollo/client";
import { GET_AUTH_INFO } from "@/graphql/queries/queries";

// On définit un nouveau contexte React avec un objet contenant 2 proprietes,
// un boolean(connecté ou non) et une fonction vide (force l'execution de GAT_AUTH_INFO
// pour verifier que l'user est tjrs connecté)
export const UserContext = createContext({
    isLoggedIn: false,
    refetchLogin: () => { },
});

const Layout = ({ children }: { children: ReactNode }) => {
    // useQuery exécute la requête GET_AUTH_INFO sur le serveur GraphQL
    const { data, loading, error, refetch } = useQuery<{
        // Type de reponse gaphql
        whoAmI: { isLoggedIn: boolean };
    }>(GET_AUTH_INFO);

    // Gestion de l'etat de chargement et des erreurs
    if (loading) {
        return <p>Loading</p>;
    }
    if (error) {
        return <p>Error</p>;
    }
    if (data) {
        return (
            // Composant qui rend les données stockées dans le contexte
            // accessibles à tous les composants dedans 
            <UserContext.Provider
                // prop qui definit si l'user est connecté, et la fonction qui force GET_AUTH_INFO
                value={{ isLoggedIn: data.whoAmI.isLoggedIn, refetchLogin: refetch }}
            >
                <main className="main-content">
                    <Header />
                    {children}
                </main>
            </UserContext.Provider>
        );
    }
};

export default Layout;