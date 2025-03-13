import { REGISTER_MUTATION } from "@/graphql/mutations/mutations";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useMutation } from "@apollo/client";
import { Avatar, Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import router from "next/router";

export default function RegistrationPage() {
    const [file, setFile] = useState<File>();
    const [imageURL, setImageURL] = useState<string>();
    const [registerMutation, { data, loading, error }] = useMutation(REGISTER_MUTATION);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();


    const getErrorMessage = (error: any): string | undefined => {
        if (error && error.message && typeof error.message === 'string') {
            return error.message;
        }
        return undefined;
    };

    const onSubmit = (data: any) => {
        registerMutation({
            variables: {
                newUserData: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    imageUrl: imageURL,
                    email: data.email,
                    password: data.password,
                    phone_number: data.phoneNumber,
                },
            },
        }).then(() => {
            setSuccessMessage("Inscription réussie !");
            router.push("/login");
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (successMessage) return <p>{successMessage}</p>;


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Inscription
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                        <IconButton color="primary" aria-label="upload picture" component="label" htmlFor="upload-photo">
                            {imageURL ? (
                                <Avatar src={`http://localhost:8000${imageURL}`} sx={{ width: 90, height: 90 }} />
                            ) : (
                                <PhotoCameraIcon sx={{ width: 90, height: 90 }} />
                            )}
                        </IconButton>
                        <input
                            hidden
                            accept="image/*"
                            id="upload-photo"
                            type="file"
                            onChange={async (e) => {
                                if (e.target.files) {
                                    setFile(e.target.files[0]);
                                    const url = "http://localhost:8000/upload";
                                    const formData = new FormData();
                                    formData.append("file", e.target.files[0], e.target.files[0].name);
                                    try {
                                        const response = await axios.post(url, formData);
                                        setImageURL(response.data.filename);
                                    } catch (err) {
                                        console.log("error", err);
                                    }
                                }
                            }}
                        />
                    </Box>
                    <TextField
                        required
                        label="Nom"
                        {...register("lastName", { required: "Nom requis" })}
                        error={!!errors.lastName}
                        helperText={getErrorMessage(errors.lastName)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        label="Prénom"
                        {...register("firstName", { required: "Prénom requis" })}
                        error={!!errors.firstName}
                        helperText={getErrorMessage(errors.firstName)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        label="Numéro de téléphone"
                        {...register("phoneNumber", { required: "Téléphone requis" })}
                        error={!!errors.phoneNumber}
                        helperText={getErrorMessage(errors.phoneNumber)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        required
                        label="Email"
                        {...register("email", { required: "Email requis" })}
                        error={!!errors.email}
                        helperText={getErrorMessage(errors.email)}
                        fullWidth
                        margin="normal"
                        type="email"
                    />
                    <TextField
                        required
                        label="Mot de passe"
                        {...register("password", { required: "Mot de passe requis" })}
                        error={!!errors.password}
                        helperText={getErrorMessage(errors.password)}
                        fullWidth
                        margin="normal"
                        type="password"
                    />
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" type="submit">
                            S'inscrire
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>

    );
}