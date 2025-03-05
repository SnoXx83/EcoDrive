import { LOGIN_QUERY } from "@/graphql/queries/queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "./_app";

export default function LoginPage() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    // useQuery récupère des données au chargement de la page || useLazyQuery laisse l'utilisateur envoyé la query au moment ou on clique sur login 
    const [handleLogin, { data, loading, error }] = useLazyQuery(LOGIN_QUERY, {
        onCompleted(data) {
            localStorage.setItem("jwt", data.login);
            router.push("/");
        }, onError(error){
            //toastify à implémenter 
            console.log("erreur");
        },
    });

    return (
        <div className="main">
            <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form as HTMLFormElement);

                const formJson = Object.fromEntries(formData.entries());


                const result = await handleLogin({
                    variables: {
                        userData: formJson,
                    },
                });
                localStorage.setItem("jwt", result.data.login);
                setIsLoggedIn(true);
                router.back();
            }}>
                <label>
                    Email :
                    <input type="text" name="email" />
                </label>
                <br />
                <label>
                    Mot de passe :
                    <input type="password" name="password" id="" />
                </label>
                <br />
                <button type="submit" onSubmit={(e) => { e.preventDefault(); }}>Se connecter</button>
            </form>
        </div>
    );
}