import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext} from "react";
import { UserContext } from "./Layout";

export default function Header() {
    const authInfo = useContext(UserContext);
    const router = useRouter();
    
    return (
        <header className="header">
            <div className="main-menu">
                <h1>
                    <a href="/">
                        <p><span>Eco</span>Drive</p>
                    </a>
                </h1>
                <div className="nav">
                    {/* Si isLoggedIn === true affiche ça */}
                    {authInfo.isLoggedIn ? (
                        <>
                            <Link href="/trip/searchTrip">
                                <span>Trouver un trajet</span>
                            </Link>
                            <Link href="/trip/new">
                                <span>Publier un trajet</span>
                            </Link>
                            <button onClick={()=>{
                                localStorage.removeItem("jwt");
                                authInfo.refetchLogin();
                                router.push("/");
                            }}>Déconnexion</button>
                        </>
                        // Sinon afffiche cela
                    ) : (
                        <>
                            <Link href="/login">
                                <span>Se connecter</span>
                            </Link>
                            <Link href={"/register"}>
                                <span>S'inscrire</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}