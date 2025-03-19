import { UserContext } from "@/components/Layout";
import LoginForm from "@/components/LoginForm";
import { LOGIN_QUERY } from "@/graphql/queries/queries";
import { useLazyQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const authInfo = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [handleLogin, { error }] = useLazyQuery(LOGIN_QUERY, {
        onCompleted(data) {
            if (data && data.login) {
                localStorage.setItem("jwt", data.login);
                authInfo.refetchLogin();
                router.push("/");
            }
        },
    });

    const handleFormSubmit = (formData: Record<string, string>) => {
        setErrorMessage(null);
        handleLogin({
            variables: {
                userData: formData,
            },
        });
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <LoginForm onSubmit={handleFormSubmit} />
            <div className="">
            {error && (
                <Typography color="error" mt={2}>
                    {error.message}
                </Typography>
            )}
            {errorMessage && (
                <Typography color="error" mt={2}>
                    {errorMessage}
                </Typography>
            )}
            </div>
        </Box>
    );
}