import { UserContext } from "@/components/Layout";
import { LOGIN_QUERY } from "@/graphql/queries/queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useContext } from "react";


export default function LoginPage() {
    const router = useRouter();
    const authInfo = useContext(UserContext);
    // useQuery récupère des données au chargement de la page || useLazyQuery laisse l'utilisateur envoyé la query au moment ou on clique sur login 
    const [handleLogin] = useLazyQuery(LOGIN_QUERY, {
        onCompleted(data) {
            localStorage.setItem("jwt", data.login);
            authInfo.refetchLogin();
            router.push("/");
        },
    });
    return (
        <div className="main">
            <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form as HTMLFormElement);
                const formJson = Object.fromEntries(formData.entries());

                handleLogin({
                    variables: {
                        userData: formJson,
                    },
                });
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