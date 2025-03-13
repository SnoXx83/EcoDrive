import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "./Layout";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

export default function Header() {
    const authInfo = useContext(UserContext);
    const router = useRouter();

    return (
        <AppBar sx={{
            backgroundColor: "#114360"
        }} position="fixed">
            <Toolbar>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span>Eco</span>Drive
                    </Link>
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {authInfo.isLoggedIn ? (
                        <>
                            {authInfo.role === "passenger" && (
                                <>
                                    <Button color="inherit" component={Link} href="/trip/searchTrip">
                                        Trouver un trajet
                                    </Button>
                                    <Button color="inherit" component={Link} href={`/profile/${authInfo.userId}`}>
                                        Mon profil
                                    </Button>
                                </>
                            )}
                            {authInfo.role === "driver" && (
                                <>
                                    <Button color="inherit" component={Link} href="/trip/new">
                                        Publier un trajet
                                    </Button>
                                    <Button color="inherit" component={Link} href={`/profile/${authInfo.userId}`}>
                                        Mon profil
                                    </Button>
                                </>
                            )}
                            <Button color="inherit" onClick={() => {
                                localStorage.removeItem("jwt");
                                authInfo.refetchLogin();
                                router.push("/");
                            }}>
                                Déconnexion
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} href="/login">
                                Se connecter
                            </Button>
                            <Button color="inherit" component={Link} href="/register">
                                S'inscrire
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}