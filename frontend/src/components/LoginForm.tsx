// src/components/LoginForm.tsx
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { FormEvent } from "react";

interface LoginFormProps {
    onSubmit: (formData: Record<string, string>) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries()) as Record<string, string>;
        onSubmit(formJson);
    };

    return (
        <Paper elevation={4} sx={{ padding: 4, maxWidth: 600 }}>
            <Typography className="text-center" variant="h5" component="h2" gutterBottom>
                Connexion
            </Typography>
            <form onSubmit={handleSubmit}>
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
    );
};

export default LoginForm;