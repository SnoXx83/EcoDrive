import { createContext, ReactNode } from "react";
import Header from "./Header";
import { useQuery } from "@apollo/client";
import { GET_AUTH_INFO } from "@/graphql/queries/queries";

interface AuthInfo {
    isLoggedIn: boolean;
    userId: number | null;
    role: string | null;
    refetchLogin: () => void;
}

export const UserContext = createContext<AuthInfo>({
    isLoggedIn: false,
    userId: null,
    role: null,
    refetchLogin: () => { },
});

const Layout = ({ children }: { children: ReactNode }) => {
    // useQuery exécute la requête GET_AUTH_INFO sur le serveur GraphQL
    const { data, loading, error, refetch } = useQuery<{
        // Type de reponse gaphql
        whoAmI: { isLoggedIn: boolean; userId: any | null; email: string; role: string };
    }>(GET_AUTH_INFO);

    if (loading) {
        return <p>Loading</p>;
    }
    if (error) {
        return <p>Error</p>;
    }
    if (data) {
        return (
            // Composant qui rend les données stockées dans le contexte accessibles à tous les composants dedans 
            <UserContext.Provider
                // propriete qui definit si l'user est connecté, userId, role et la fonction qui force GET_AUTH_INFO
                value={{
                    isLoggedIn: data?.whoAmI?.isLoggedIn || false,
                    refetchLogin: refetch,
                    userId: data.whoAmI.userId,
                    role: data.whoAmI.role,
                }}
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