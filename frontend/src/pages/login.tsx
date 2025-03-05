import { LOGIN_QUERY } from "@/graphql/queries/queries";
import { useLazyQuery } from "@apollo/client";

export default function LoginPage() {
    // useQuery récupère des données au chargement de la page || useLazyQuery laisse l'utilisateur envoyé la query au moment ou on clique sur login 
    const [handleLogin, { data, loading, error }] = useLazyQuery(LOGIN_QUERY);

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
                <button type="submit" onSubmit={(e) => { e.preventDefault(); }}>S'inscrire</button>
            </form>
        </div>
    );
}