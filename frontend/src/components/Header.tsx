import { AuthContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext} from "react";

export default function Header() {
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        router.push("/login");
    };
    return (
        <header className="header">
            <div className="main-menu">
                <h1>
                    <a href="/">
                        <p><span>Eco</span>Drive</p>
                    </a>
                </h1>
                <div className="nav">
                    {isLoggedIn ? (
                        <>
                            <Link href="/trip/searchTrip">
                                <span>Trouver un trajet</span>
                            </Link>
                            <Link href="/trip/new">
                                <span>Publier un trajet</span>
                            </Link>
                            <button onClick={handleLogout}>Déconnexion</button>
                        </>
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