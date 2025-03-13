import { UserContext } from "@/components/Layout";
import { LOGIN_QUERY } from "@/graphql/queries/queries";
import { useLazyQuery } from "@apollo/client";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
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
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <Paper elevation={4} sx={{ padding: 4, maxWidth: 600 }}>
                <Typography className="text-center" variant="h5" component="h2" gutterBottom>
                    Connexion
                </Typography>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.target;
                        const formData = new FormData(form as HTMLFormElement);
                        const formJson = Object.fromEntries(formData.entries());

                        handleLogin({
                            variables: {
                                userData: formJson,
                            },
                        });
                    }}
                >
                    <TextField
                        required
                        id="email"
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="text"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        id="password"
                        label="Mot de passe"
                        variant="outlined"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                    />
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button type="submit" variant="contained">
                            Se connecter
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}